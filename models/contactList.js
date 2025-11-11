const mongoose = require('mongoose');

const contactListSchema = new mongoose.Schema({
  name: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  contacts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Contact' }]
}, {
  versionKey: false,
  timestamps: true
});

module.exports = mongoose.model('ContactList', contactListSchema);