const express = require('express');
const router = express.Router();
const {userAuth} = require('../middlewares/auth');
const messageCtrl=require("../controllers/message")

router.get('/messages/:contactId', userAuth, messageCtrl.getMessages);
router.post('/send-message', userAuth, messageCtrl.sendMessageToCustomer);

router.get('/user-message-stats',userAuth, messageCtrl.getUserMessageStats);
router.get('/message-trends',userAuth, messageCtrl.getMessageTrends);
router.get('/top-contacts',userAuth, messageCtrl.getTopContacts);
router.get('/export-csv',userAuth, messageCtrl.exportMessagesCsv);


module.exports = router;




