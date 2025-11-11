const express = require("express");
const router = express.Router();
const sendTemplateMessageCtrl = require("../controllers/sendTemplateMessage");
const {userAuth} = require("../middlewares/auth");


router.post("/send", userAuth, sendTemplateMessageCtrl.sendTemplateMessage);
router.post("/send-test", sendTemplateMessageCtrl.sendTemplateMessageTesting);
router.post("/send-test2", sendTemplateMessageCtrl.sendTextTemplateMessageTesting);


module.exports = router;
