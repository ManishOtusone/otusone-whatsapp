const mongoose = require('mongoose');
const tagSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: String, trim: true },
    displayColor: {
      main: { type: String, default: '#000000' },
      light: { type: String, default: '#ffffff' }
    },
  
    isFirstMessage: { type: Boolean, default: false },
    isJourneyEvent: { type: Boolean, default: false },
  
    firstMessages: [{ type: String }],
    assistantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assistant', required: true },
}, {
    versionKey: false,
    timestamps: true
});

module.exports = mongoose.model('Tag', tagSchema);
