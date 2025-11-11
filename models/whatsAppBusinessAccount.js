const { required } = require('joi');
const mongoose = require('mongoose');

const wabaSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    businessId: { type: String },
    displayName: { type: String },
    phoneNumberId: { type: String },
    phoneNumber: { type: String },
    verifiedName: { type: String },

    accessToken: { type: String },
    tokenExpiresAt: { type: Date },

}, {
    versionKey: false,
    timestamps: true
});

module.exports = mongoose.model('Waba', wabaSchema);
