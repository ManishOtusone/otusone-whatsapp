const mongoose = require('mongoose');

const whatsAppLinkSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  phone: { type: String, required: true },
  message: { type: String },
  shortCode: { type: String, required: true, unique: true }, 
},{
    versionKey: false,
    timestamps: true
});

module.exports = mongoose.model('WhatsAppLink', whatsAppLinkSchema);
