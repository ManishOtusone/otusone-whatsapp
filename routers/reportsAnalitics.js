const express = require('express');
const router = express.Router();
const reportsAndAnaliticsCtrl = require('../controllers/reportsAndAnalitics');
const { userAuth } = require('../middlewares/auth');

router.get('/analytics-stats', userAuth, reportsAndAnaliticsCtrl.getCampaignStats);

module.exports = router;
