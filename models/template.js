const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User',required:true },

  name: { type: String },
  category: { type: String },
  language: { type: String },
  status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' },

  components: [mongoose.Schema.Types.Mixed], // Meta body/header/button

  metaTemplateId: { type: String },
  lastSyncedAt: {type:Date},

},{
    versionKey: false,
    timestamps: true
});

module.exports = mongoose.model('Template', templateSchema);
