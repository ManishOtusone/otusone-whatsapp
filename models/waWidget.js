const mongoose = require("mongoose");

const widgetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  phone: { type: String, required: true },
  widgetId: { type: String, unique: true }, // e.g., short ID for loading script
  ctaText: { type: String, default: "Chat with us" },
  buttonColor: { type: String, default: "#4dc247" },
  position: { type: String, enum: ["bottom-left", "bottom-right"], default: "bottom-right" },
  message: { type: String, default: "Hi" },
  brand: {
    name: {type:String},
    subtitle: {type:String},
    color: {type:String},
    imageUrl: {type:String},
    widgetCtaText: {type:String},
    onScreenMsg: {type:String},
  },
  openByDefault: { type: Boolean, default: true },
  reOpenRule: { type: String, enum: ["always", "after_24h"], default: "always" },
}, { timestamps: true });

module.exports = mongoose.model("WhatsAppWidget", widgetSchema);
