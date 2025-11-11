const mongoose = require('mongoose');

const messageLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  contactId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contact' },
  campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' },

  templateName: {type:String},
  whatsAppNumber: {type:String},
  messageId: {type:String},

  status: { type: String, default: 'sent' },
  statusTimestamp: {type:Date},

}, {
    versionKey: false,
    timestamps: true
});

module.exports = mongoose.model('MessageLog', messageLogSchema);
