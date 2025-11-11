const mongoose = require('mongoose');

const webhookEventSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  eventType: {type:String},
  payload: mongoose.Schema.Types.Mixed,
}, {
    versionKey: false,
    timestamps: true
});

module.exports = mongoose.model('WebhookEvent', webhookEventSchema);
