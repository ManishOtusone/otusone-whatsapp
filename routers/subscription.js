const express = require('express');
const router = express.Router();
const subscriptionController= require('../controllers/subscription');
const { userAuth } = require('../middlewares/auth');

router.post('/update-plan', userAuth, subscriptionController.updatePlan);
router.post('/recharge', userAuth, subscriptionController.rechargeCredits);
router.get('/get', userAuth, subscriptionController.getSubscription);

module.exports = router;
