const axios = require('axios');


exports.sendWhatsAppChatbotMessage = async (to, message, phoneNumberId, metaAccessToken) => {
  if (!metaAccessToken) {
    console.error("Missing WhatsApp token");
    return;
  }

  const url = `https://graph.facebook.com/v22.0/${phoneNumberId}/messages`;
  let data;

  // 1. Plain Text
  if (typeof message === 'string') {
    data = {
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: {
        body: message,
        preview_url: false,
      },
    };
  }

  // 2. Interactive Button
  else if (message.type === 'button') {
    if (!message.body || !Array.isArray(message.buttons) || message.buttons.length === 0) {
      console.error('Invalid button message format');
      return;
    }

    const buttons = message.buttons.slice(0, 3).map((btn, idx) => ({
      type: 'reply',
      reply: {
        id: btn.id || `btn_${idx + 1}`,
        title: btn.title,
      },
    }));

    data = {
      messaging_product: 'whatsapp',
      to,
      type: 'interactive',
      interactive: {
        type: 'button',
        body: { text: message.body },
        action: { buttons },
      },
    };
  }

  // 3. Image Message
  else if (message.type === 'image') {
    if (!message.link && !message.id) {
      console.error("Image message requires 'link' or 'id'");
      return;
    }

    data = {
      messaging_product: 'whatsapp',
      to,
      type: 'image',
      image: {
        link: message.link,
        caption: message.caption || '',
        id: message.id,
      },
    };
  }

  // 4. PDF or Document
  else if (message.type === 'document') {
    if (!message.link && !message.id) {
      console.error("Document message requires 'link' or 'id'");
      return;
    }

    data = {
      messaging_product: 'whatsapp',
      to,
      type: 'document',
      document: {
        link: message.link,
        filename: message.filename || 'document.pdf',
        caption: message.caption || '',
        id: message.id,
      },
    };
  }

  // 5. List Menu
  else if (message.type === 'list') {
    if (!message.body || !message.button || !Array.isArray(message.sections)) {
      console.error("Invalid list message structure");
      return;
    }

    data = {
      messaging_product: 'whatsapp',
      to,
      type: 'interactive',
      interactive: {
        type: 'list',
        header: message.header ? { type: 'text', text: message.header } : undefined,
        body: { text: message.body },
        footer: message.footer ? { text: message.footer } : undefined,
        action: {
          button: message.button,
          sections: message.sections,
        },
      },
    };
  }

  // 6. Fallback
  else {
    console.error("Unsupported message format:", message);
    return;
  }

  try {
    const response = await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${metaAccessToken}`,
        'Content-Type': 'application/json',
      },
    });

    const metaMessageId = response.data.messages?.[0]?.id;
    console.log('Message sent to:', to, '| Meta Message ID:', response.data.messages?.[0]?.id);
    return metaMessageId;
  } catch (err) {
    console.error('Failed to send WhatsApp message:', err.response?.data || err.message);
  }
};

