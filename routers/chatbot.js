const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbot');
const {userAuth} = require('../middlewares/auth');


router.use(userAuth);
router.post('/save', chatbotController.saveChatbot);
router.patch('/save-changes/:chatbotId', chatbotController.updateChatbot);
router.post('/validate-chatboat-name', chatbotController.validateChatbotName);
router.get('/all', chatbotController.getAllChatbots);
router.get('/:chatbotId', chatbotController.getChatbotsById);
router.delete('/:chatbotId', chatbotController.deleteChatbot);

router.post("/test-chatboat",chatbotController.findChatBotAndSendMessage)

module.exports = router;
