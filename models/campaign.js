const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String,enum:['API','BROADCAST','SCHEDULE'], required: true, default:"SCHEDULE" },
  templateName: { type: String, required: true },
  language: { type: String, default: 'en_US' },
  
  headerImageUrl: { type: String, default: '' },
  headerText: { type: String, default: '' },
  footerText: { type: String, default: '' },
  buttons: [{
    type: {type: String,},
    text: {type: String,},
    url: {type:String}
  }],
  
  bodyVariables: [{ type: String }],

  contactListId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Contact', required: true }],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  scheduledAt: { type: Date, required: true },
  repeat: { type: String, enum: ['none', 'daily', 'twice_a_day', 'hourly', 'custom_interval'], default: 'none' },
  intervalMinutes: { type: Number, default: null },
  lastSentAt: { type: Date, default: null },

  status: { type: String, enum: ['pending', 'in_progress', 'completed', 'failed'], default: 'pending' },
  campaignStatus: { type: String, enum: ['Live','Stop','Paused'], default: 'Live',required:true },

  totalContacts: { type: Number, default: 0 },
  successCount: { type: Number, default: 0 },
  failedCount: { type: Number, default: 0 },
  messageCount: { type: Number, default: 0 },
  errorLogs: [{
    contactId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contact' },
    message: { type: String, default: "" }
  }],
  bodyVariableBindings: [
    {
      position: {type:Number}, // for {{1}} -> 1, {{2}} -> 2
      sourceField: {type:String}, // e.g., "name", "dob", etc.
      fallback: {type:String} // Optional fallback value if contact is missing this field
    }
  ],

}, { timestamps: true });

module.exports = mongoose.model('Campaign', campaignSchema);
