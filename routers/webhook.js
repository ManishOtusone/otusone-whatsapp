const express = require('express');
const router = express.Router();
const whatsappWebhookController = require('../controllers/whatsappWebhook');
const {userAuth} = require('../middlewares/auth');

// router.post('/whatsapp', whatsappWebhookController.receiveWebhook);
router.post('/whatsapp', whatsappWebhookController.handleIncomingMessage);
router.get('/whatsapp', whatsappWebhookController.verifyWebhook); 
router.post('/subscribe-webhook', userAuth, whatsappWebhookController.subscribeWebhook);
module.exports = router;
