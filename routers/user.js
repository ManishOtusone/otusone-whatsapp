const express = require('express');
const router = express.Router();
const {userAuth} = require('../middlewares/auth');
const userAuthCtrl= require('../controllers/userAuth');

router.post('/send-otp', userAuthCtrl.sendOtp);
router.post('/verify-otp', userAuthCtrl.verifyOtp);
router.patch('/complete-signup',userAuth, userAuthCtrl.completeSignup);
router.post('/login', userAuthCtrl.login);
router.get('/profile',userAuth, userAuthCtrl.getProfile);
router.get('/meta-connected/profile',userAuth, userAuthCtrl.getUserProfile);
router.patch('/profile',userAuth, userAuthCtrl.updateProfile);


router.patch('/update-webhook',userAuth, userAuthCtrl.updateMetaWebhookConfig);



module.exports = router;
