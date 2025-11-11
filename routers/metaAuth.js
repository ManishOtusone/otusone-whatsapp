const express = require('express');
const router = express.Router();
const {userAuth} = require('../middlewares/auth');
const metaAuth=require("../controllers/metaAuthCtrl")

router.get('/login-url', userAuth, metaAuth.getMetaLoginUrl);
router.get('/callback', metaAuth.metaAuthCallback);

module.exports = router;
