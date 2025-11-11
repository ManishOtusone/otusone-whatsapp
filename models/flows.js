const mongoose = require('mongoose');

const FieldSchema = new mongoose.Schema({
    label: { type: String, required: true },
    fieldType: { type: String, enum: ['text', 'email', 'number', 'dropdown', 'checkbox'], required: true },
    name: { type: String, required: true }, // e.g. userName, userEmail
    required: { type: Boolean, default: true },
    options: [String], // for dropdowns or checkboxes
});

const WhatsAppFlowSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    description: { type: String },
    fields: [FieldSchema], // fields to show in the form
    meta: {
        tags: [String],
        category: { type: String },
        status: { type: String, enum: ['draft', 'published'], default: 'draft' }
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

WhatsAppFlowSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('WhatsAppFlow', WhatsAppFlowSchema);
