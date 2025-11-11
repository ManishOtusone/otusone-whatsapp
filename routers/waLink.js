const express = require('express');
const router = express.Router();
const WhatsAppLink = require('../models/waLink');
const WhatsAppLinkCtrl = require('../controllers/waLinkGenerator');
const { userAuth } = require('../middlewares/auth');

router.get('/:shortCode', async (req, res) => {
  const { shortCode } = req.params;

  const record = await WhatsAppLink.findOne({ shortCode });

  if (!record) return res.status(404).send('Invalid link');

  const encodedMessage = encodeURIComponent(record.message || '');
  const redirectUrl = `https://wa.me/${record.phone}?text=${encodedMessage}`;

  return res.redirect(302, redirectUrl);
});

router.post("/create-wa-link",userAuth,WhatsAppLinkCtrl.createWhatsAppLink)

module.exports = router;
