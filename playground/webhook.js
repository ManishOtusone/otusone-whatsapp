exports.handleIncomingMessage = async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const phoneNumberId = value?.metadata?.phone_number_id;
    const statuses = value?.statuses;

    if (statuses && statuses.length > 0) {
      const status = statuses[0];
      const { id: messageId, status: deliveryStatus, timestamp } = status;

      await Message.findOneAndUpdate(
        { messageId },
        { status: deliveryStatus, statusTimestamp: new Date(Number(timestamp) * 1000) }
      );
      return res.sendStatus(200);
    }

    const messages = value?.messages;
    if (!messages || messages.length === 0) return res.sendStatus(200);

    const user = await User.findOne({ phoneNumberId });
    if (!user) return res.status(404).json({ error: "User not found" });

    const { metaAccessToken } = user;

    for (const message of messages) {
      const from = message.from;
      const messageId = message.id;
      const timestamp = message.timestamp;
      const normalizedNumber = from.startsWith('+') ? from : `+${from}`;

      // De-duplication check
      const alreadyExists = await Message.exists({ messageId });
      if (alreadyExists) continue;

      let contact = await Contact.findOne({ whatsAppNumber: normalizedNumber, userId: user._id });
      if (!contact) {
        contact = await Contact.create({
          userId: user._id,
          whatsAppNumber: normalizedNumber,
          optedIn: true,
          lastActive: new Date(),
        });
      } else {
        contact.lastActive = new Date();
        contact.optedIn = true;
        await contact.save();
      }

      let messageText = '';
      let msgObj = {
        userId: user._id,
        contactId: contact._id,
        direction: 'inbound',
        timestamp: new Date(Number(timestamp) * 1000),
        messageId,
        status: 'received',
        rawPayload: message,
      };

      switch (message.type) {
        case 'text':
          messageText = message.text.body;
          break;
        case 'button':
          messageText = message.button.text;
          break;
        case 'interactive':
          messageText =
            message.interactive?.button_reply?.title ||
            message.interactive?.list_reply?.title ||
            '[Interactive message]';
          msgObj.interactiveType = message.interactive?.type;
          msgObj.interactivePayload = message.interactive?.button_reply || message.interactive?.list_reply;
          break;
        case 'image':
          messageText = '[Image received]';
          msgObj.mediaType = 'image';
          msgObj.mediaUrl = message.image?.link;
          msgObj.mediaCaption = message.image?.caption;
          break;
        case 'document':
          messageText = '[Document received]';
          msgObj.mediaType = 'document';
          msgObj.mediaUrl = message.document?.link;
          msgObj.mediaCaption = message.document?.caption;
          break;
        default:
          messageText = `[Unsupported message type: ${message.type}]`;
      }

      msgObj.message = messageText;

      await Message.create(msgObj);
      global._io.to(String(contact._id)).emit('new_message', msgObj);

      const activeChatbots = await Chatbot.find({
        userId: user._id,
        waPhoneNumberId: phoneNumberId,
        'metadata.status': 'active',
      });

      let session = await ChatSession.findOne({ userId: user._id, contactId: contact._id });

      // Handle session timeout
      if (session) {
        const TWO_MINUTES = 2 * 60 * 1000;
        if (Date.now() - new Date(session.updatedAt).getTime() > TWO_MINUTES) {
          await ChatSession.deleteOne({ _id: session._id });

          const timeoutMessage = "Your session has expired due to inactivity. Please start again.";
          const sentMessageId = await sendWhatsAppChatbotMessage(normalizedNumber, timeoutMessage, phoneNumberId, metaAccessToken);

          await Message.create({
            userId: user._id,
            contactId: contact._id,
            direction: 'outbound',
            message: timeoutMessage,
            timestamp: new Date(),
            messageId: sentMessageId,
            status: 'sent',
          });

          global._io.to(String(contact._id)).emit('new_message', {
            userId: user._id,
            contactId: contact._id,
            direction: 'outbound',
            message: timeoutMessage,
            timestamp: new Date(),
            messageId: sentMessageId,
            status: 'sent',
          });

          session = null;
        }
      }

      // Handle chatbot selection
      const botSelectId = message?.interactive?.button_reply?.id;
      if (
        message.type === 'interactive' &&
        botSelectId?.startsWith('select_bot_') &&
        !session
      ) {
        const selectedBotId = botSelectId.replace('select_bot_', '');
        const selectedBot = await Chatbot.findById(selectedBotId);
        if (!selectedBot) return res.sendStatus(200);

        const startNode = selectedBot.nodes.find((n) => n.data?.type === 'triggerChatbot');
        if (!startNode) return res.sendStatus(200);

        session = await ChatSession.create({
          userId: user._id,
          contactId: contact._id,
          chatbotId: selectedBot._id,
          currentNodeId: startNode.id,
          invalidAttempts: 0,
        });

        const description = startNode.data?.description || '[No response configured]';
        const buttons = startNode.data?.buttons || [];
        const outgoingMsg = buttons.length
          ? {
              type: 'button',
              body: description,
              buttons: buttons.map((btn, idx) => ({
                title: btn.title || `Option ${idx + 1}`,
                id: btn.id || `btn_${idx + 1}`,
              })),
            }
          : description;

        const sentMessageId = await sendWhatsAppChatbotMessage(normalizedNumber, outgoingMsg, phoneNumberId, metaAccessToken);
        await Message.create({
          userId: user._id,
          contactId: contact._id,
          direction: 'outbound',
          message: typeof outgoingMsg === 'string' ? outgoingMsg : outgoingMsg.body,
          interactiveType: outgoingMsg.type,
          interactivePayload: outgoingMsg.buttons,
          timestamp: new Date(),
          messageId: sentMessageId,
          status: 'sent',
        });

        global._io.to(String(contact._id)).emit('new_message', {
          userId: user._id,
          contactId: contact._id,
          direction: 'outbound',
          message: typeof outgoingMsg === 'string' ? outgoingMsg : outgoingMsg.body,
          interactiveType: outgoingMsg.type,
          interactivePayload: outgoingMsg.buttons,
          timestamp: new Date(),
          messageId: sentMessageId,
          status: 'sent',
        });

        continue;
      }

      // Ask to pick bot if none selected and no session
      if (!session && activeChatbots.length > 0 && messageText !== '[Unsupported message type]') {
        const botOptions = activeChatbots.map((bot, i) => ({
          title: bot.name || `Bot ${i + 1}`,
          id: bot._id.toString(),
        }));

        const outgoingMsg = {
          type: 'button',
          body: 'How can I help you? Please select what you’re looking for.',
          buttons: botOptions.map((btn) => ({
            title: btn.title,
            id: `select_bot_${btn.id}`,
          })),
        };

        const sentMessageId = await sendWhatsAppChatbotMessage(normalizedNumber, outgoingMsg, phoneNumberId, metaAccessToken);
        await Message.create({
          userId: user._id,
          contactId: contact._id,
          direction: 'outbound',
          message: outgoingMsg.body,
          interactiveType: 'button',
          interactivePayload: outgoingMsg.buttons,
          timestamp: new Date(),
          messageId: sentMessageId,
          status: 'sent',
        });

        global._io.to(String(contact._id)).emit('new_message', {
          userId: user._id,
          contactId: contact._id,
          direction: 'outbound',
          message: outgoingMsg.body,
          interactiveType: 'button',
          interactivePayload: outgoingMsg.buttons,
          timestamp: new Date(),
          messageId: sentMessageId,
          status: 'sent',
        });

        continue;
      }

      // If session exists, proceed with flow
      if (session) {
        const chatbot = await Chatbot.findById(session.chatbotId);
        const currentNode = chatbot.nodes.find((n) => n.id === session.currentNodeId);
        if (!currentNode) continue;

        const userInput = messageText.trim().toLowerCase();
        let nextEdge = chatbot.edges.find(
          (e) => e.source === currentNode.id && e.label?.trim().toLowerCase() === userInput
        );

        if (!nextEdge) {
          const defaultEdge = chatbot.edges.find((e) => e.source === currentNode.id && !e.label);
          if (!defaultEdge) {
            session.invalidAttempts = (session.invalidAttempts || 0) + 1;

            if (session.invalidAttempts >= 3) {
              await ChatSession.deleteOne({ _id: session._id });
              const endMessage = "Too many failed attempts. Ending the session.";
              const sentMessageId = await sendWhatsAppChatbotMessage(normalizedNumber, endMessage, phoneNumberId, metaAccessToken);
              await Message.create({
                userId: user._id,
                contactId: contact._id,
                direction: 'outbound',
                message: endMessage,
                timestamp: new Date(),
                messageId: sentMessageId,
                status: 'sent',
              });
              global._io.to(String(contact._id)).emit('new_message', {
                userId: user._id,
                contactId: contact._id,
                direction: 'outbound',
                message: endMessage,
                timestamp: new Date(),
                messageId: sentMessageId,
                status: 'sent',
              });
              continue;
            }

            await session.save();
            const retryMsg = "Sorry, I didn't understand. Please try again.";
            const retryMessageId = await sendWhatsAppChatbotMessage(normalizedNumber, retryMsg, phoneNumberId, metaAccessToken);
            await Message.create({
              userId: user._id,
              contactId: contact._id,
              direction: 'outbound',
              message: retryMsg,
              timestamp: new Date(),
              messageId: retryMessageId,
              status: 'sent',
            });
            continue;
          }

          nextEdge = defaultEdge;
        }

        const nextNode = chatbot.nodes.find((n) => n.id === nextEdge.target);
        if (!nextNode) continue;

        const description = nextNode.data?.description || '[No response configured]';
        const buttons = nextNode.data?.buttons || [];

        const outgoingMsg = buttons.length
          ? {
              type: 'button',
              body: description,
              buttons: buttons.map((btn, idx) => ({
                title: btn.title || `Option ${idx + 1}`,
                id: btn.id || `btn_${idx + 1}`,
              })),
            }
          : description;

        const sentMessageId = await sendWhatsAppChatbotMessage(normalizedNumber, outgoingMsg, phoneNumberId, metaAccessToken);
        await Message.create({
          userId: user._id,
          contactId: contact._id,
          direction: 'outbound',
          message: typeof outgoingMsg === 'string' ? outgoingMsg : outgoingMsg.body,
          interactiveType: typeof outgoingMsg !== 'string' ? outgoingMsg.type : undefined,
          interactivePayload: typeof outgoingMsg !== 'string' ? outgoingMsg.buttons : undefined,
          timestamp: new Date(),
          messageId: sentMessageId,
          status: 'sent',
        });

        session.currentNodeId = nextNode.id;
        session.updatedAt = new Date();
        session.invalidAttempts = 0;
        await session.save();

        global._io.to(String(contact._id)).emit('new_message', {
          userId: user._id,
          contactId: contact._id,
          direction: 'outbound',
          message: typeof outgoingMsg === 'string' ? outgoingMsg : outgoingMsg.body,
          interactiveType: typeof outgoingMsg !== 'string' ? outgoingMsg.type : undefined,
          interactivePayload: typeof outgoingMsg !== 'string' ? outgoingMsg.buttons : undefined,
          timestamp: new Date(),
          messageId: sentMessageId,
          status: 'sent',
        });
      }
    }

    return res.sendStatus(200);
  } catch (err) {
    console.error("Webhook error:", err);
    res.sendStatus(500);
  }
};