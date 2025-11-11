const express = require('express');
const router = express.Router();
const { createCheckoutSession, confirmSubscription,upgradePlan } = require('../controllers/checkout');
const {userAuth} = require('../middlewares/auth');

router.post('/upgrade-plan', userAuth, upgradePlan);


router.post('/create-checkout-session', userAuth, createCheckoutSession);
router.get('/confirm-subscription', userAuth, confirmSubscription);

module.exports = router;
