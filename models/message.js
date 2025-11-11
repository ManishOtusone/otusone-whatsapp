const mongoose = require('mongoose');

const errorSchema = new mongoose.Schema({
  code: { type: Number },
  title: { type: String },
  message: { type: String },
  details: { type: String },
}, { _id: false });

const messageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  contactId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contact' },

  direction: { type: String, enum: ['inbound', 'outbound'], required: true }, 
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  messageId: { type: String, required: true, unique: true },
  status: { type: String, default: 'sent' },
  statusTimestamp: { type: Date },

  mediaType: {type:String}, // 'image', 'document', etc.
  mediaUrl: {type:String},
  mediaCaption: {type:String},
  interactiveType: {type:String}, // 'button', 'list'
  interactivePayload: {type:mongoose.Schema.Types.Mixed},
  error: errorSchema,
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
