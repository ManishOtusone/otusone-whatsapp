const mongoose = require('mongoose');

const campaignLogSchema = new mongoose.Schema({
  campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true },
  contactId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contact', required: true },
  status: { type: String, enum: ['success', 'failed'], required: true },
  error: { type: String },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('CampaignLog', campaignLogSchema);
