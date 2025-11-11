const axios = require('axios');


const resolveBodyVariables = (bodyVariables = [], bindings = [], contact = {}) => {
  const bindingMap = {};
  bindings.forEach(b => {
    bindingMap[b.position] = {
      sourceField: b.sourceField,
      fallback: b.fallback,
    };
  });

  return bodyVariables.map((val, idx) => {
    const position = idx + 1;
    if (bindingMap[position]) {
      const { sourceField, fallback } = bindingMap[position];
      const resolved = contact[sourceField] ?? fallback ?? val;
      return { type: "text", text: resolved };
    }
    return { type: "text", text: val }; 
  });
};


exports.sendTemplate = async ({ campaign, contact }) => {
  const user = campaign.userId;
  const phoneNumberId = user.phoneNumberId;
  const accessToken = user.metaAccessToken;

  if (!phoneNumberId || !accessToken) {
    throw new Error('Meta configuration is missing.');
  }

  const components = [];

  // Header
  if (campaign.headerImageUrl) {
    components.push({
      type: "header",
      parameters: [
        {
          type: "image",
          image: { link: campaign.headerImageUrl },
        },
      ],
    });
  } else if (campaign.headerText) {
    components.push({
      type: "header",
      parameters: [
        {
          type: "text",
          text: campaign.headerText,
        },
      ],
    });
  }

  // Body
  if (campaign.bodyVariables.length > 0) {
    components.push({
      type: "body",
      parameters: campaign.bodyVariables.map((val) => ({
        type: "text",
        text: val,
      })),
    });
  }

  // Footer
  if (campaign.footerText) {
    components.push({ type: "footer", parameters: [] });
  }

  // Buttons
  if (campaign.buttons.length > 0) {
    campaign.buttons.forEach((btnText, idx) => {
      if (btnText.type && btnText.type.toLowerCase() === "url") return;
      components.push({
        type: "button",
        sub_type: "quick_reply",
        index: `${idx}`,
        parameters: [{ type: "payload", payload: btnText.text }],
      });
    });
  }

  const payload = {
    messaging_product: "whatsapp",
    to: contact.whatsAppNumber,
    type: "template",
    template: {
      name: campaign.templateName,
      language: { code: campaign.language || "en_US" },
      components: components,
    },
  };

  const response = await axios.post(
    `https://graph.facebook.com/v22.0/${phoneNumberId}/messages`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

exportssendTemplate2 = async ({ campaign, contact }) => {
  const user = campaign.userId;
  const phoneNumberId = user.phoneNumberId;
  const accessToken = user.metaAccessToken;

  if (!phoneNumberId || !accessToken) {
    throw new Error('Meta configuration is missing.');
  }

  const components = [];

  // Header
  if (campaign.headerImageUrl) {
    components.push({
      type: "header",
      parameters: [
        {
          type: "image",
          image: { link: campaign.headerImageUrl },
        },
      ],
    });
  } else if (campaign.headerText) {
    components.push({
      type: "header",
      parameters: [
        {
          type: "text",
          text: campaign.headerText,
        },
      ],
    });
  }

  // Body
  if (campaign.bodyVariables.length > 0) {
    components.push({
      type: "body",
      parameters: resolveBodyVariables(campaign.bodyVariables, campaign.bodyVariableBindings, contact),
    });
    
  }

  // Footer
  if (campaign.footerText) {
    components.push({ type: "footer", parameters: [] });
  }

  // Buttons
  if (campaign.buttons.length > 0) {
    campaign.buttons.forEach((btnText, idx) => {
      if (btnText.type && btnText.type.toLowerCase() === "url") return;
      components.push({
        type: "button",
        sub_type: "quick_reply",
        index: `${idx}`,
        parameters: [{ type: "payload", payload: btnText.text }],
      });
    });
  }

  const payload = {
    messaging_product: "whatsapp",
    to: contact.whatsAppNumber,
    type: "template",
    template: {
      name: campaign.templateName,
      language: { code: campaign.language || "en_US" },
      components: components,
    },
  };

  const response = await axios.post(
    `https://graph.facebook.com/v22.0/${phoneNumberId}/messages`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};