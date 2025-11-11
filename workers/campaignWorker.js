const { Worker } = require('bullmq');
const { redisConnection } = require('../config/queue');
const Campaign = require('../models/campaign');
const User = require('../models/user');
const CampaignLog = require('../models/campaignLog');
const axios = require('axios');

const campaignWorker = new Worker('campaignQueue', async (job) => {
  const { campaignId } = job.data;

  const campaign = await Campaign.findById(campaignId)
    .populate('contactListId')
    .populate('userId');

  const contacts = campaign.contactListId;
  const user = campaign.userId;

  const phoneNumberId = user.phoneNumberId;
  const accessToken = user.metaAccessToken;

  let success = 0;
  let failed = 0;

  for (const contact of contacts) {
    try {
      const components = [];

      if (campaign.headerImageUrl) {
        components.push({
          type: "header",
          parameters: [
            { type: "image", image: { link: campaign.headerImageUrl } },
          ],
        });
      } else if (campaign.headerText) {
        components.push({
          type: "header",
          parameters: [{ type: "text", text: campaign.headerText }],
        });
      }

      if (campaign.bodyVariables.length > 0) {
        components.push({
          type: "body",
          parameters: campaign.bodyVariables.map((val) => ({
            type: "text",
            text: val,
          })),
        });
      }

      if (campaign.footerText) {
        components.push({ type: "footer" });
      }

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
          components,
        },
      };

      await axios.post(
        `https://graph.facebook.com/v17.0/${phoneNumberId}/messages`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      await CampaignLog.create({
        campaignId: campaign._id,
        contactId: contact._id,
        status: 'success',
        timestamp: new Date(),
      });

      success++;
    } catch (err) {
      await CampaignLog.create({
        campaignId: campaign._id,
        contactId: contact._id,
        status: 'failed',
        error: err?.response?.data?.error?.message || err.message,
        timestamp: new Date(),
      });
      failed++;
    }
  }

  campaign.successCount = success;
  campaign.failedCount = failed;
  campaign.status = 'completed';
  campaign.messageCount = contacts.length;
  campaign.totalContacts = contacts.length;
  await campaign.save();

}, { connection: redisConnection });

module.exports = campaignWorker;
