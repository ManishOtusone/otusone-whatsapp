const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  name: {type:String},
  whatsAppNumber: { type: String, required: true }, // E.164 format
  countryCode: { type: String },
  source: { type: String, enum: ['API', 'ORGANIC', 'IMPORT', 'MANUAL'], default: 'API' },

  tags: [{ type: String }],
  optedIn: { type: Boolean, default: false }, 
  blocked: { type: Boolean, default: false },
  isClosed: { type: Boolean, default: false },
  isIntervened: { type: Boolean, default: false },

  firstMessage: { type: Date },
  lastActive: { type: Date },
  sessionPeriod: { type: Date }, // 24-hour window

  activeFlowId: { type: mongoose.Schema.Types.ObjectId, ref: 'Flow' },
  currentFlowMessageId: { type: String },
  noOfFlowAttempt: { type: Number, default: 0 },

  address: [{ type: String }],

  createdOn: { type: Date, default: Date.now },
  offmessageSetTime: { type: Date },
  intervenedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  params: { type: Object, default: {} } // for storing custom fields if needed

}, {
    versionKey: false,
    timestamps: true
});

module.exports = mongoose.model('Contact', contactSchema);
