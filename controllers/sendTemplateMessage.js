const axios = require("axios");
const User = require("../models/user");

exports.sendTemplateMessage2 = async (req, res) => {
  try {
    const { recipientNumber, templateName, languageCode, variables } = req.body;
    const user = await User.findById(req.user._id);

    if (!user.phoneNumberId || !user.metaAccessToken) {
      return res.status(400).json({ error: "Meta config missing in user profile" });
    }

    const payload = {
      messaging_product: "whatsapp",
      to: recipientNumber,
      type: "template",
      template: {
        name: templateName,
        language: { code: languageCode || "en_US" },
        components: [
          {
            type: "body",
            parameters: variables.map(value => ({
              type: "text",
              text: value,
            })),
          },
        ],
      },
    };

    const response = await axios.post(
      `https://graph.facebook.com/v22.0/${user.phoneNumberId}/messages`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${user.metaAccessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json({ message: "Message sent", response: response.data });
  } catch (error) {
    console.error("Send Template Message Error:", error?.response?.data || error);
    res.status(500).json({ error: "Failed to send message" });
  }
};

exports.sendTemplateMessageTesting = async (req, res) => {
  try {
    const { recipientNumber, templateName, languageCode, variables,headerImageUrl } = req.body;
     const phoneNumberId=process.env.PHONE_NUMBER_ID;
     const metaAccessToken= process.env.WA_ACCESS_TOKEN;
    const payload ={
      messaging_product: "whatsapp",
      to: recipientNumber,
      type: "template",
      template: {
        name:templateName,
        language: { code:languageCode ||  "en_US" },
        components: [
          {
            type: "header",
            parameters: [
              {
                type: "image",
                image: {
                  link: headerImageUrl || "https://www.otusone.com/static/media/image%2047.df34624262b9f35bcb11.png"
                }
              }
            ]
          },  {
            type: "body",
            parameters: variables.map(value => ({
              type: "text",
              text: value,
            })),
          }
        ]
      }
    }
    const response = await axios.post(
      `https://graph.facebook.com/v22.0/${phoneNumberId}/messages`,payload,
      {
        headers: {
          Authorization: `Bearer ${metaAccessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json({ message: "Message sent", response: response.data });
  } catch (error) {
    console.error("Send Template Message Error:", error?.response?.data || error);
    res.status(500).json({ error: "Failed to send message" });
  }
};

exports.sendTextTemplateMessageTesting = async (req, res) => {
  try {
    const { recipientNumber, templateName, languageCode, variables,headerImageUrl } = req.body;
     const phoneNumberId=process.env.PHONE_NUMBER_ID;
     const metaAccessToken= process.env.WA_ACCESS_TOKEN;
     console.log("metaAccessToken",metaAccessToken)
     console.log("phoneNumberId",phoneNumberId)

    const payload = {
      messaging_product: "whatsapp",
      to: recipientNumber,
      type: "template",
      template: {
        name: templateName,
        language: { code: languageCode || "en_US" },
      },
    };

    console.log("payload",payload)
 
    const response = await axios.post(
      `https://graph.facebook.com/v22.0/${phoneNumberId}/messages`,payload,
      {
        headers: {
          Authorization: `Bearer ${metaAccessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json({ message: "Message sent", response: response.data });
  } catch (error) {
    console.error("Send Template Message Error:", error?.response?.data || error);
    res.status(500).json({ error: "Failed to send message" });
  }
};

exports.sendTemplateMessage = async (req, res) => {
  try {
    const {
      recipientNumber,
      templateName,
      languageCode = "en_US",
      bodyVariables = [],
      headerImageUrl,
      headerText, 
      footerText,
      buttons = [],
    } = req.body;

    const user = await User.findById(req.user._id);
    const phoneNumberId = user.phoneNumberId;
    const accessToken = user.metaAccessToken;

    
    let tempPayload;
    if (!phoneNumberId || !accessToken) {
      return res.status(400).json({ error: "Meta configuration is missing." });
    }

    // Start building components array
    const components = [];

    // Add header if provided
    if (headerImageUrl) {
      components.push({
        type: "header",
        parameters: [
          {
            type: "image",
            image: { link: headerImageUrl },
          },
        ],
      });
    } else if (headerText) {
      components.push({
        type: "header",
        parameters: [
          {
            type: "text",
            text: headerText,
          },
        ],
      });
    }

    // Add body if provided
    if (bodyVariables.length > 0) {
      components.push({
        type: "body",
        parameters: bodyVariables.map((value) => ({
          type: "text",
          text: value,
        })),
      });
    }

    // Add footer if provided
    if (footerText) {
      components.push({
        type: "footer",
        parameters: [], // Footer doesn't take variables
      });
    }

    // Add buttons if provided
    if (buttons.length > 0) {
      components.push({
        type: "button",
        sub_type: "quick_reply",
        index: "0", // you can use "0", "1" for multiple buttons
        parameters: buttons.map((btnText) => ({
          type: "payload",
          payload: btnText,
        })),
      });
    }

    const payload = {
      messaging_product: "whatsapp",
      to: recipientNumber,
      type: "template",
      template: {
        name: templateName,
        language: { code: languageCode },
        components: components,
      },
    };
    tempPayload=payload

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

    res.status(200).json({ message: "Message sent", response: response.data,
    tempPayload

     });
  } catch (error) {
    console.error("Send Template Message Error:", error?.response?.data || error);
    res.status(500).json({ error: error?.response?.data || "Failed to send message" });
  }
};
