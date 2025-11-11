const Contact = require('../models/contact');
const User = require('../models/user');
const Message = require('../models/message');
const Chatbot = require('../models/chatbot');
const ChatSession = require('../models/chatSession');
const axios = require('axios');
const { sendWhatsAppChatbotMessage } = require('../utils/chatbotMessage');

exports.subscribeWebhook = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user || !user.metaAccessToken || !user.whatsappBusinessAccountId) {
      return res.status(400).json({ message: 'Meta credentials not found. Please complete login.' });
    }

    const { metaAccessToken, whatsappBusinessAccountId } = user;

    const response = await axios.post(
      `https://graph.facebook.com/v19.0/${whatsappBusinessAccountId}/subscribed_apps`,
      null,  // no body needed here
      {
        params: {
          access_token: metaAccessToken,
          subscribed_fields: 'messages,statuses'
        }
      }
    );

    return res.json({ message: 'Webhook subscribed successfully', data: response.data });
  } catch (error) {
    console.error('Subscribe Webhook Error:', error.response?.data || error.message);
    return res.status(500).json({ message: 'Failed to subscribe to webhook' });
  }
};



exports.verifyWebhook = (req, res) => {
  const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;

  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token && mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('WEBHOOK_VERIFIED');
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
};

exports.receiveWebhook = async (req, res) => {
  try {

    console.log("req.body", req.body)
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const messages = value?.messages;
    const statuses = value?.statuses;

    console.log("statuses", statuses);
    console.log("messages", messages);
    console.log("changes", changes);
    console.log("value", value);

    if (messages) {
      const msg = messages[0];
      const waId = msg.from; // WhatsApp number in E.164 format
      const timestamp = new Date(Number(msg.timestamp) * 1000);

      let contact = await Contact.findOne({ whatsAppNumber: waId });

      if (!contact) {
        // First time contact (opted in)
        contact = new Contact({
          whatsAppNumber: waId,
          name: msg.profile?.name || '',
          optedIn: true,
          firstMessage: timestamp,
          lastActive: timestamp
        });
        await contact.save();
      } else {
        // Update existing contact
        contact.lastActive = timestamp;
        contact.optedIn = true; // Message received = opt-in
        if (!contact.firstMessage) contact.firstMessage = timestamp;
        await contact.save();
      }
    }

    // When a message delivery/read status is updated
    if (statuses) {
      const status = statuses[0];
      const waId = status.recipient_id;
      const timestamp = new Date(Number(status.timestamp) * 1000);

      const contact = await Contact.findOne({ whatsAppNumber: waId });
      if (contact) {
        contact.lastActive = timestamp;
        await contact.save();
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('Webhook Error:', error);
    res.sendStatus(500);
  }
};



// live chat
exports.handleIncomingMessage2 = async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const phoneNumberId = value?.metadata?.phone_number_id;
    const statuses = value?.statuses;

    if (statuses && statuses?.length > 0) {
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

    const message = messages[0];
    const from = message.from;
    const messageId = message.id;
    const timestamp = message.timestamp;

    const user = await User.findOne({ phoneNumberId });
    if (!user) return res.status(404).json({ error: "User not found" });

    const { metaAccessToken } = user;
    const normalizedNumber = from.startsWith('+') ? from : `+${from}`;
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
    if (message.text?.body) {
      messageText = message.text.body;
    } else if (message.type === 'button' && message.button?.text) {
      messageText = message.button.text;
    } else if (message.type === 'interactive') {
      messageText =
        message.interactive?.button_reply?.title ||
        message.interactive?.list_reply?.title ||
        'Received interactive message';
    } else if (message.type === 'image') {
      messageText = '[Image received]';
    } else if (message.type === 'document') {
      messageText = '[Document received]';
    } else {
      messageText = '[Unsupported message type]';
    }


    const msgObj = {
      userId: user._id,
      contactId: contact._id,
      direction: 'inbound',
      message: messageText,
      timestamp: new Date(Number(timestamp) * 1000),
      messageId,
      status: 'received'
    };

    if (message.type === 'image') {
      msgObj.mediaType = 'image';
      msgObj.mediaUrl = message.image?.link;
      msgObj.mediaCaption = message.image?.caption;
    }
    if (message.type === 'document') {
      msgObj.mediaType = 'document';
      msgObj.mediaUrl = message.document?.link;
      msgObj.mediaCaption = message.document?.caption;
    }

    // Interactive responses
    if (message.type === 'interactive') {
      msgObj.interactiveType = message.interactive?.type;
      msgObj.interactivePayload = message.interactive?.button_reply || message.interactive?.list_reply;
    }

    await Message.create(msgObj);
    global._io.to(String(contact._id)).emit('new_message', msgObj);

    const chatbot = await Chatbot.findOne({
      userId: user._id,
      waPhoneNumberId: phoneNumberId,
      'metadata.status': 'active',
    });

    if (!chatbot) return res.sendStatus(200);

    let session = await ChatSession.findOne({
      userId: user._id,
      contactId: contact._id,
      chatbotId: chatbot._id,
    });

    if (!session) {
      const startNode = chatbot.nodes.find((n) => n.data?.type === 'triggerChatbot');
      if (!startNode) return res.sendStatus(200);

      session = await ChatSession.create({
        userId: user._id,
        contactId: contact._id,
        chatbotId: chatbot._id,
        currentNodeId: startNode.id,
      });

      const description = startNode.data?.description || '[No response configured]';
      const buttons = startNode.data?.buttons || [];

      const outgoingMsg = (Array.isArray(buttons) && buttons.length > 0)
        ? {
          type: 'button',
          body: description,
          buttons: buttons.map((btn, idx) => ({
            title: btn.title || `Option ${idx + 1}`,
            id: btn.id || `btn_${idx + 1}`,
          }))
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
        messageId: sentMessageId,
        timestamp: new Date(),
        status: 'sent',
      });
      global._io.to(String(contact._id)).emit('new_message', {
        userId: user._id,
        contactId: contact._id,
        direction: 'outbound',
        message: typeof outgoingMsg === 'string' ? outgoingMsg : outgoingMsg.body,
        interactiveType: typeof outgoingMsg !== 'string' ? outgoingMsg.type : undefined,
        interactivePayload: typeof outgoingMsg !== 'string' ? outgoingMsg.buttons : undefined,
        messageId: sentMessageId,
        timestamp: new Date(),
        status: 'sent',
      });

      return res.sendStatus(200);
    }

    const currentNode = chatbot.nodes.find((n) => n.id === session.currentNodeId);
    if (!currentNode) return res.sendStatus(200);

    const userInput = (messageText || '').trim().toLowerCase();

    let nextEdge = chatbot.edges.find(
      (e) => e.source === currentNode.id && e.label?.trim().toLowerCase() === userInput
    );

    if (!nextEdge) {
      const defaultEdge = chatbot.edges.find((e) => e.source === currentNode.id && !e.label);
      if (!defaultEdge) {
        const sentMessageId = await sendWhatsAppChatbotMessage(normalizedNumber, "Thanks! That's the end of the chat.", phoneNumberId, metaAccessToken);
        await ChatSession.deleteOne({ _id: session._id });
        global._io.to(String(contact._id)).emit('new_message', {
          userId: user._id,
          contactId: contact._id,
          direction: 'outbound',
          message: "Thanks! That's the end of the chat.",
          messageId: sentMessageId,
          timestamp: new Date(),
          status: 'sent',
        });
        return res.sendStatus(200);
      }
      nextEdge = defaultEdge;
    }

    const nextNode = chatbot.nodes.find((n) => n.id === nextEdge.target);
    if (!nextNode) return res.sendStatus(200);

    const description = nextNode.data?.description || '[No response configured]';
    const buttons = nextNode.data?.buttons || [];

    const outgoingMsg = (Array.isArray(buttons) && buttons.length > 0)
      ? {
        type: 'button',
        body: description,
        buttons: buttons.map((btn, idx) => ({
          title: btn.title || `Option ${idx + 1}`,
          id: btn.id || `btn_${idx + 1}`,
        }))
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
    session.lastMessage = description;
    session.updatedAt = new Date();
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
    res.sendStatus(200);
  } catch (err) {
    console.error("Webhook error:", err);
    res.sendStatus(500);
  }
};


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

    const message = messages[0];
    const from = message.from;
    const messageId = message.id;
    const timestamp = message.timestamp;

    const user = await User.findOne({ phoneNumberId });
    if (!user) return res.status(404).json({ error: "User not found" });

    const { metaAccessToken } = user;
    const normalizedNumber = from.startsWith('+') ? from : `+${from}`;
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
    if (message.text?.body) {
      messageText = message.text.body;
    } else if (message.type === 'button' && message.button?.text) {
      messageText = message.button.text;
    } else if (message.type === 'interactive') {
      messageText =
        message.interactive?.button_reply?.title ||
        message.interactive?.list_reply?.title ||
        'Received interactive message';
    } else if (message.type === 'image') {
      messageText = '[Image received]';
    } else if (message.type === 'document') {
      messageText = '[Document received]';
    } else {
      messageText = '[Unsupported message type]';
    }

    const msgObj = {
      userId: user._id,
      contactId: contact._id,
      direction: 'inbound',
      message: messageText,
      timestamp: new Date(Number(timestamp) * 1000),
      messageId,
      status: 'received',
    };

    if (message.type === 'image') {
      msgObj.mediaType = 'image';
      msgObj.mediaUrl = message.image?.link;
      msgObj.mediaCaption = message.image?.caption;
    }

    if (message.type === 'document') {
      msgObj.mediaType = 'document';
      msgObj.mediaUrl = message.document?.link;
      msgObj.mediaCaption = message.document?.caption;
    }

    if (message.type === 'interactive') {
      msgObj.interactiveType = message.interactive?.type;
      msgObj.interactivePayload = message.interactive?.button_reply || message.interactive?.list_reply;
    }

    await Message.create(msgObj);
    global._io.to(String(contact._id)).emit('new_message', msgObj);

    const activeChatbots = await Chatbot.find({
      userId: user._id,
      waPhoneNumberId: phoneNumberId,
      'metadata.status': 'active',
    });

    let session = await ChatSession.findOne({ userId: user._id, contactId: contact._id });

    if (session) {
      const TWO_MINUTES = 2 * 60 * 1000;
      const now = new Date();
      const lastUpdated = new Date(session.updatedAt);

      if (now - lastUpdated > TWO_MINUTES) {
        // Session expired, delete it
        await ChatSession.deleteOne({ _id: session._id });

        // Optionally notify user
        const timeoutMessage = "Your session has expired due to inactivity. Please start again.";
        const sentMessageId = await sendWhatsAppChatbotMessage(normalizedNumber, timeoutMessage, phoneNumberId, metaAccessToken);

        await Message.create({
          userId: user._id,
          contactId: contact._id,
          direction: 'outbound',
          message: timeoutMessage,
          timestamp: now,
          messageId: sentMessageId,
          status: 'sent',
        });

        global._io.to(String(contact._id)).emit('new_message', {
          userId: user._id,
          contactId: contact._id,
          direction: 'outbound',
          message: timeoutMessage,
          timestamp: now,
          messageId: sentMessageId,
          status: 'sent',
        });

        // Reset session so the chatbot restart logic runs again
        session = null;
      }
    }


    // If user selected a chatbot
    console.log("message.type", message.type)
    console.log("message.interactive?.button_reply", message.interactive?.button_reply?.id?.startsWith('select_bot_'))
    if (
      message.type === 'interactive' &&
      message.interactive?.button_reply?.id?.startsWith('select_bot_') &&
      !session
    ) {
      const selectedBotId = message.interactive.button_reply.id.replace('select_bot_', '');
      console.log("selectedBotId", selectedBotId)
      const selectedBot = await Chatbot.findById(selectedBotId);
      // console.log("selectedBot",selectedBot)

      if (!selectedBot) return res.sendStatus(200);

      const startNode = selectedBot.nodes.find((n) => n.data?.type === 'triggerChatbot');
      const startNode2 = selectedBot.nodes.find((n) => console.log(n.data?.type));
      if (!startNode) return res.sendStatus(200);

      session = await ChatSession.create({
        userId: user._id,
        contactId: contact._id,
        chatbotId: selectedBot._id,
        currentNodeId: startNode.id,
      });

      const description = startNode.data?.description || '[No response configured]';
      const buttons = startNode.data?.buttons || [];
      const outgoingMsg = buttons.length > 0
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

      return res.sendStatus(200);
    }

    // No session and multiple bots? Ask user to pick
    if (!session && activeChatbots.length > 0) {
      console.log("inside start")
      const botOptions = activeChatbots.map((bot, i) => ({
        title: bot.name || `Bot ${i + 1}`,
        id: bot._id.toString(),
      }));

      const outgoingMsg = {
        type: 'button',
        body: 'How can I help you?. Please select the option what you looking for?',
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

      return res.sendStatus(200);
    }

    // Handle session/chat flow
    if (session) {
      const chatbot = await Chatbot.findById(session.chatbotId);
      const currentNode = chatbot.nodes.find((n) => n.id === session.currentNodeId);
      if (!currentNode) return res.sendStatus(200);

      const userInput = (messageText || '').trim().toLowerCase();
      console.log("userInput", userInput);

      let nextEdge = chatbot.edges.find(
        (e) => e.source === currentNode.id && e.label?.trim().toLowerCase() === userInput
      );

      console.log("nextEdge", nextEdge)
      if (!nextEdge) {
        const defaultEdge = chatbot.edges.find((e) => e.source === currentNode.id && !e.label);
        console.log("defaultEdge",defaultEdge)
        if (!defaultEdge) {
          const endMessage = "Thanks! That's the end of the chat.";
          const sentMessageId = await sendWhatsAppChatbotMessage(normalizedNumber, endMessage, phoneNumberId, metaAccessToken);

          await ChatSession.deleteOne({ _id: session._id });
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
          return res.sendStatus(200);
        }
        nextEdge = defaultEdge;
      }

      const nextNode = chatbot.nodes.find((n) => n.id === nextEdge.target);
      console.log("nextNode",nextNode)
      if (!nextNode) return res.sendStatus(200);

      const description = nextNode.data?.description || '[No response configured]';
      const buttons = nextNode.data?.buttons || [];

      const outgoingMsg = buttons.length > 0
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
      session.lastMessage = description;
      session.updatedAt = new Date();
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

      return res.sendStatus(200);
    }

    return res.sendStatus(200);
  } catch (err) {
    console.error("Webhook error:", err);
    res.sendStatus(500);
  }
};


exports.handleChatbotMessage = async (req, res) => {
  try {
    const { phoneNumberId, metaAccessToken } = req.user;
    const { to, message } = req.body;

    if (!to || !message) {
      return res.status(400).json({ error: 'Missing required fields: to or message' });
    }

    await sendWhatsAppChatbotMessage(to, message, phoneNumberId, metaAccessToken);
    return res.status(200).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error sending chatbot message:', error);
    return res.status(500).json({ error: 'Failed to send message' });
    // return res.status(500).json({ message:error.message || 'Failed to send message' });
  }
};


