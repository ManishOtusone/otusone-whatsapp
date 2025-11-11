const cron = require('node-cron');
const Campaign = require('./models/campaign');
const {sendTemplate} = require('./utils/sendTemplate');

function startCampaignScheduler() {
  // Runs every minute
  cron.schedule('* * * * *', async () => {
    const now = new Date();
    console.log("Scheduler running at:", now);

    // Find campaigns with relevant statuses that could run now or repeat
    const campaigns = await Campaign.find({
      status: { $in: ['pending', 'completed'] },
      scheduledAt: { $lte: now },
    }).populate('contactListId').populate('userId');

    console.log(`Found ${campaigns.length} campaigns to check.`);

    for (const campaign of campaigns) {
      const { repeat = 'none', scheduledAt, lastSentAt, intervalMinutes } = campaign;

      // Determine if campaign should run now based on repeat type
      let shouldSend = false;

      switch (repeat) {
        case 'none':
          // Run once if pending and scheduled time passed
          shouldSend = campaign.status === 'pending' && scheduledAt <= now;
          break;

        case 'daily':
          // Run if never sent or last sent was more than 24h ago
          shouldSend = !lastSentAt || (now - new Date(lastSentAt)) >= 24 * 60 * 60 * 1000;
          break;

        case 'twice_a_day':
          // Run if never sent or last sent was more than 12h ago
          shouldSend = !lastSentAt || (now - new Date(lastSentAt)) >= 12 * 60 * 60 * 1000;
          break;

        case 'hourly':
          // Run if never sent or last sent was more than 1h ago
          shouldSend = !lastSentAt || (now - new Date(lastSentAt)) >= 60 * 60 * 1000;
          break;

        case 'custom_interval':
          // Run if never sent or last sent was more than intervalMinutes ago
          shouldSend = !lastSentAt || (now - new Date(lastSentAt)) >= (intervalMinutes || 0) * 60 * 1000;
          break;
      }

      if (!shouldSend) {
        console.log(`Skipping campaign ${campaign._id} due to repeat rules.`);
        continue;
      }

      console.log(`Triggering campaign ${campaign._id} (repeat: ${repeat})`);

      campaign.status = 'in_progress';
      await campaign.save();

      const contacts = campaign.contactListId;

      let success = 0;
      let failed = 0;
      const errorLogs = [];

      for (const contact of contacts) {
        try {
          await sendTemplate({ campaign, contact });
          success++;
        } catch (err) {
          failed++;
          errorLogs.push({
            contactId: contact._id,
            message: err?.response?.data?.error?.message || err.message,
          });
          console.error(`Error sending to contact ${contact._id}:`, err.message);
        }
      }

      campaign.successCount = success;
      campaign.failedCount = failed;
      campaign.totalContacts = contacts.length;
      campaign.messageCount = success + failed;
      campaign.errorLogs = errorLogs;
      campaign.lastSentAt = now;

      // For repeat campaigns, keep status 'completed' to allow next run.
      // For non-repeat, finalize campaign
      if (repeat === 'none') {
        campaign.status = 'completed';
      } else {
        campaign.status = 'completed'; // or keep as 'pending' if you want to re-trigger from 'pending'
      }

      await campaign.save();
    }
  });
}

module.exports = startCampaignScheduler;
