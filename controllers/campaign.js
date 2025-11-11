const Campaign = require('../models/campaign');
const ContactList = require('../models/contactList');
const Contact = require('../models/contact');
const axios = require("axios");
const User = require("../models/user");
const { campaignQueue } = require("../config/queue");
const moment = require('moment-timezone');

const tenMinutesLaterInIndia = moment().tz('Asia/Kolkata').add(10, 'minutes');
const utcDate = tenMinutesLaterInIndia.utc().toISOString();

// console.log(utcDate); 


exports.createCampaign = async (req, res) => {
  try {
    const userId = req.user._id;
    let { name, templateName, language, bodyVariables, contactListId, scheduledAt, repeat, intervalMinutes, headerImageUrl, buttons } = req.body;

    bodyVariables = bodyVariables?.map(item => item.example);

    if (!name || !templateName || !contactListId || !scheduledAt) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    const duplicate = await Campaign.findOne({
      userId,
      name: { $regex: `^${name}$`, $options: 'i' }
    });

    if (duplicate) {
      return res.status(409).json({
        message: `Campaign with the name "${name}" already exists. Please use a different name.`
      });
    }

    // Convert IST to UTC using moment-timezone
    const scheduledAtUTC = moment.tz(scheduledAt, 'Asia/Kolkata').utc().toDate();

    const newCampaign = new Campaign({
      name,
      headerImageUrl,
      templateName,
      language: language || 'en_US',
      bodyVariables: bodyVariables || [],
      buttons: buttons || [],
      contactListId,
      userId,
      scheduledAt: scheduledAtUTC, // ensure it's a valid Date
      repeat, intervalMinutes,
      status: 'pending'
    });

    await newCampaign.save();

    res.status(201).json({
      message: 'Campaign created successfully',
      campaign: newCampaign
    });
  } catch (error) {
    console.error('Create Campaign Error:', error);
    res.status(500).json({ message: error?.message || 'Internal server error' });
  }
};

exports.getAllCampaigns = async (req, res) => {
  try {
    const {_id:userId} = req.user;

    const {
      status,
      templateName,
      name,
      fromDate,
      toDate,
      sortBy = 'createdAt',
      sortOrder = 'desc', 
    } = req.query;

    const filter = { userId };

    if (status) filter.status = status;
    if (templateName) filter.templateName = { $regex: new RegExp(templateName, 'i') };
    if (name) filter.name = { $regex: new RegExp(name, 'i') };
    if (fromDate || toDate) {
      filter.createdAt = {};
      if (fromDate) filter.createdAt.$gte = new Date(fromDate);
      if (toDate) filter.createdAt.$lte = new Date(toDate);
    }

    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const campaigns = await Campaign.find(filter).sort(sort);

    res.status(200).json({message:"Camapign list found successfully", campaigns });
  } catch (error) {
    console.error('Get Campaigns Error:', error);
    res.status(500).json({ message: error?.message || 'Internal server error' });
  }
};

exports.sendCampaign = async (req, res) => {
  try {
    const { campaignId } = req.params;
    const userId = req.user._id;

    const campaign = await Campaign.findOne({ _id: campaignId, userId }).populate('contactListId');
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    if (campaign.status === 'completed') {
      return res.status(400).json({ message: 'Campaign has already been sent.' });
    }

    const contactList = campaign.contactListId
    if (!contactList) {
      return res.status(404).json({ message: 'Contact list not found' });
    }

    let successCount = 0;
    let failedCount = 0;

    for (const contact of contactList.contacts) {
      if (!contact.whatsAppNumber) {
        console.warn(`Skipping contact ${contact._id}: missing whatsAppNumber number`);
        failedCount++;
        continue;
      }

      try {
        await sendMessageToContact(contact, campaign);
        successCount++;
      } catch (err) {
        console.error(`Failed to send to ${contact.whatsAppNumber}:`, err.message);
        failedCount++;
      }
    }

    campaign.status = 'completed';
    campaign.successCount = successCount;
    campaign.failedCount = failedCount;
    campaign.totalContacts = contactList.contacts.length;
    await campaign.save();

    res.status(200).json({
      message: `Campaign sent. Success: ${successCount}, Failed: ${failedCount}`,
      campaign,
    });
  } catch (error) {
    console.error('Send Campaign Error:', error);
    res.status(500).json({ message: error?.message || 'Internal server error.' });
  }
};

exports.triggerCampaignNow = async (req, res) => {
  const { campaignId } = req.params;
  const userId = req.user._id;

  const campaign = await Campaign.findOne({ _id: campaignId, userId })
    .populate('contactListId')
    .populate('userId');


  // console.log("campaign",campaign)
  if (!campaign) return res.status(404).json({ message: "Campaign not found" });

  const contacts = campaign.contactListId;
  const user = campaign.userId;

  const phoneNumberId = user.phoneNumberId;
  const accessToken = user.metaAccessToken;


  if (!phoneNumberId || !accessToken) {
    return res.status(400).json({ error: "Meta configuration is missing." });
  }

  let success = 0;
  let failed = 0;
  const errorLogs = [];

  let tempPayload;

  for (const contact of contacts) {
    try {
      const components = [];

      // console.log("headerImageUrl",campaign.headerImageUrl)
      // console.log("headerText",campaign?.headerText)
      // console.log("bodyVariables",campaign.bodyVariables)
      // console.log("footerText",campaign.footerText)
      // console.log("buttons",campaign.buttons)

      // console.log("whatsAppNumber",contact.whatsAppNumber)
      // console.log("templateName",campaign.templateName)
      // console.log(" campaign.language", campaign.language)

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
        components.push({ type: "footer", parameters: [], });
      }

      // Buttons
      if (campaign.buttons.length > 0) {
        campaign.buttons.forEach((btnText, idx) => {
          components.push({
            type: "button",
            sub_type: "quick_reply",
            index: `${idx}`,
            parameters: [{ type: "payload", payload: btnText }],
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



      tempPayload = payload
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



      success++;
    } catch (err) {
      failed++;
      console.error(`Error sending to ${contact.whatsAppNumber}:`, err?.response?.data || err.message);

      errorLogs.push({
        contactId: contact._id,
        message: err?.response?.data?.error?.message || err.message,
      });
    }
  }

  campaign.successCount = success;
  campaign.failedCount = failed;
  campaign.status = 'completed';
  campaign.errorLogs = errorLogs;
  campaign.totalContacts = contacts.length;
  campaign.messageCount = success + failed;

  await campaign.save();

  res.status(200).json({
    message: 'Campaign triggered manually',
    success,
    failed,
    total: contacts.length,
    tempPayload
  });
};

exports.triggerScheduledCampaignNow = async (req, res) => {
  const { campaignId } = req.params;
  const userId = req.user._id;

  const campaign = await Campaign.findOne({ _id: campaignId, userId })
    .populate('contactListId');

  if (!campaign) return res.status(404).json({ message: "Campaign not found" });

  const totalContacts = campaign.contactListId.length;

  if (totalContacts > 500) {
    // Queue it
    await campaignQueue.add('sendCampaign', { campaignId });
    campaign.status = 'queued';
    await campaign.save();

    return res.status(202).json({ message: 'Campaign queued for processing' });
  }

  // fallback to direct send for < 500
  // Or you could always use queue
  await campaignQueue.add('sendCampaign', { campaignId });

  res.status(200).json({ message: 'Campaign started (queued)' });
};

exports.testTriggerCampaignNow = async (req, res) => {
  try {
    const { whatsAppNumber, template } = req.body;
    const {
      templateName,
      languageCode = "en_US",
      headerImageUrl,
      headerText,
      footerText,
      buttons = [], } = template;
    const { variables = [] } = template;

    const extractVariables = variables?.map(item => item.example);

    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const phoneNumberId = user.phoneNumberId;
    const accessToken = user.metaAccessToken;

    if (!phoneNumberId || !accessToken) {
      return res.status(400).json({ error: "Meta configuration is missing." });
    }

    const components = [];

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

    // Body
    if (extractVariables?.length > 0) {
      components.push({
        type: "body",
        parameters: extractVariables.map((val) => ({
          type: "text",
          text: val,
        })),
      });
    }

    // Footer
    if (footerText) {
      components.push({ type: "footer", parameters: [], });
    }

    // Buttons
    if (buttons.length > 0) {
      buttons.forEach((btnText, idx) => {
        // Skip if type is URL
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
      to: whatsAppNumber,
      type: "template",
      template: {
        name: templateName,
        language: {
          code: languageCode || "en_US",
        },
        components,
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

    res.status(200).json({
      message: "Campaign triggered successfully",
      response: response.data,
      payload,
    });
  } catch (err) {
    console.error("Error sending WhatsApp message:", err?.response?.data || err.message);
    res.status(500).json({
      message: err?.response?.data?.error?.message || "Failed to send message",
    });
  }
};

