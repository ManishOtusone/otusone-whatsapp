const express = require('express');
const router = express.Router();
const {apiKeyAuth,checkAPILimit,checkPermission} = require('../middlewares/apiKey');
const messageCtrl=require("../controllers/message");
const apiKeyCtrl=require("../controllers/integration");
const { userAuth } = require('../middlewares/auth');


router.post('/generate-api-key',userAuth,apiKeyCtrl.generateAPIKey)
router.delete('/revoke-api-key/:keyId',userAuth,apiKeyCtrl.revokeAPIKey)
router.get('/api-key',userAuth,apiKeyCtrl.getUserAPIKeys)

router.post('/send-message',apiKeyAuth,checkPermission('send_message'),checkAPILimit, apiKeyCtrl.sendTemplateMessage);



module.exports = router;




