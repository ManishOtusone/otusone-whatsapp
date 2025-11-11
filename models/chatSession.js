const mongoose = require('mongoose');

const ChatSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  contactId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contact' },
  chatbotId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chatbot' },
  currentNodeId: { type: String },
  lastMessage: { type: String },
  context: { type: mongoose.Schema.Types.Mixed }, // store variables if needed
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('ChatSession', ChatSessionSchema);
