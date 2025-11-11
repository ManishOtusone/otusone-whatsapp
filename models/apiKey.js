const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");

const apiKeySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User',required: true },
  key: { type: String, unique: true,required: true},
  secret: {type: String,required: true},
  name: {type: String,required: true},
  scopes: { type: [String], default: [] },
  isActive: {type: Boolean,default: true},
  lastUsedAt: {type:Date},
  usageToday: {type: Number, default: 0},
  dailyLimit: {type: Number,default: 1000 }
}, {
  versionKey: false,
  timestamps: true
});

apiKeySchema.methods.verifySecret = async function(secret) {
  return await bcrypt.compare(secret, this.secret);
};

apiKeySchema.pre('save', async function(next) {
  if (this.isModified('secret') && !this.secret.startsWith('$2b$')) {
    this.secret = await bcrypt.hash(this.secret, 10);
  }
  next();
});


module.exports = mongoose.model('APIKey', apiKeySchema);
