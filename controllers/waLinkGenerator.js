const WhatsAppLink = require('../models/waLink');
const generateShortCode = require('../services/waShortCodeGenerator');

exports.createWhatsAppLink = async (req, res) => {
  const { phone, message } = req.body;
  const { _id: userId } = req.user;

  if (!phone) return res.status(400).json({ success: false, message: 'Phone number is required' });

  const shortCode = generateShortCode();

  const newLink = new WhatsAppLink({
    userId,
    phone,
    message,
    shortCode
  });

  await newLink.save();

//   const fullShortLink = `https://www.otusone.com/${shortCode}`;
  const fullShortLink = `https://otusone-whatsapp.onrender.com/wa-link/${shortCode}`;
  res.status(201).json({ success: true, shortLink: fullShortLink, data: newLink });
};


