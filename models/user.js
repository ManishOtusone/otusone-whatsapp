const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const userSchema = new mongoose.Schema({
    name: { type: String, },
    email: { type: String, unique: true },
    whatsAppNumber: { type: String },
    password: { type: String },
    address: { type: String, default: "" },
    avatar: { type: String, default: "" },

    // general
    language: { type: String, default: "English" },
    timeZone: { type: String, default: "(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi" },


    // business
    businessIndustry: { type: String },
    businessDescription: { type: String },
    websiteUrl: { type: String },


    // Meta WhatsApp Config
    whatsappBusinessAccountId: { type: String },
    phoneNumberId: { type: String },
    metaAccessToken: { type: String },
    metaTokenExpiresAt: { type: Date },
    webhookUrl: { type: String },
    whatsappVerifyToken: { type: String },

    verified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },

    token:{type:String},
    deviceToken: { type: String, trim: true },
    lastLogin: { type: Date, default: null },
    isSignupComplete:{type: Boolean, default: false},
    isTermsAndConditionsAccepted: { type: Boolean, default: false },
}, {
    versionKey: false,
    timestamps: true
});

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    return userObject
  }
  
  
  userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({_id: user._id.toString(),}, process.env.JWT_SECRET, {
      expiresIn: process.env.TOKEN_EXPIRE
    })
    user.token = token
    await user.save()
    return token
  }
  
  userSchema.pre("save", async function (next) {
    const user = this;
    if (user.isModified("password")) {
      user.password = await bcrypt.hash(user.password, 10)
    }
  
    next();
  })

module.exports = mongoose.model('User', userSchema);
