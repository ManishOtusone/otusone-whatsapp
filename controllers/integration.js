const ApiKey = require("../models/apiKey");
const crypto = require('crypto');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/user');
const axios = require("axios");

exports.generateAPIKey = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;
    const { name, scopes = [] } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Key name is required", });
    }

    if (!Array.isArray(scopes)) {
      return res.status(400).json({ message: "Scopes must be an array", });

    }

    // Generate cryptographically secure keys
    const key = crypto.randomBytes(32).toString('hex');
    const secret = crypto.randomBytes(32).toString('hex');

    const existingActiveKey = await ApiKey.findOne({ userId, isActive: true });
    if (existingActiveKey) {
      return res.status(403).json({ message: "You already have an active API key. Revoke it before generating a new one", });
    }

    const apiKey = new ApiKey({
      userId,
      key,
      secret,
      name,
      scopes,
      isActive: true,
      dailyLimit: 1000,
      usageToday: 0
    });

    await apiKey.save();

    res.status(201).json({
      success: true,
      data: {
        id: apiKey._id,
        name: apiKey.name,
        key: apiKey.key,
        scopes: apiKey.scopes,
        createdAt: apiKey.createdAt,
        secret
      }
    });

  } catch (error) {
    console.error('Error generating API key:', error);

    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(409).json({ message: "YAPI key generation conflict. Please try again.", });
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: messages, });
    }
  }
};

exports.revokeAPIKey = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;
    const { keyId } = req.params;

    if (!keyId) {
      return res.status(400).json({ message: "Key ID is required'", });
    }
    const apiKey = await ApiKey.findOneAndDelete({ _id: keyId, userId });
    if (!apiKey) {
      return res.status(404).json({ message: "API key not found or access denied", });

    }
    res.json({
      message: "Deleted successfully",
      data: {
        id: apiKey._id,
        name: apiKey.name,
        key: apiKey.key,
      }
    });

  } catch (error) {
    console.error('Error revoking API key:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: "Invalid API key ID format", });
    }
    return res.status(500).json({ message: error?.message || "Internal server error. Please try again later", });

  }
};

exports.getUserAPIKeys = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;
    const { includeRevoked = false } = req.query; // Get from query params

    const query = { userId };
    if (!includeRevoked || includeRevoked === 'false') {
      query.isActive = true;
    }

    const apiKeys = await ApiKey.find(query)
      .sort({ createdAt: -1 })
      .select('-secret -__v'); // Exclude sensitive fields

    res.json({
      success: true,
      count: apiKeys.length,
      apiKeys: apiKeys
    });

  } catch (error) {
    console.error('Error fetching API keys:', error);
    next(error);
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
    tempPayload = payload

    const response = await axios.post(`https://graph.facebook.com/v22.0/${phoneNumberId}/messages`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json({
      message: "Message sent", response: response.data,
      tempPayload
    });
  } catch (error) {
    console.error("Send Template Message Error:", error?.response?.data || error);
    res.status(500).json({ error: error?.response?.data || "Failed to send message" });
  }
};