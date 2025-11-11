const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

const subscriptionSchema = new Schema({
  userId: { type: Types.ObjectId, ref: 'User', required: true, unique: true },
  plan: { type: String, enum: ['Free', 'Basic', 'Pro','Enterprise'], default: 'Free' },
  wccBalance: { type: Number, default: 0 },
  creditsLastUpdated: { type: Date, default: Date.now },
  qualityRating: { type: String, enum: ['high', 'medium', 'low'], default: 'high' },
  wabaAPIStatus: { type: String, enum: ['live', 'inactive'], default: 'live' },
}, { timestamps: true });

module.exports = mongoose.model('Subscription', subscriptionSchema);
