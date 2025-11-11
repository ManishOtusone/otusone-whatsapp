const express = require("express");
const router = express.Router();
const compainCtrl = require("../controllers/campaign");
const {userAuth} = require("../middlewares/auth");

router.post("/create-new", userAuth, compainCtrl.createCampaign);
router.get("/list", userAuth, compainCtrl.getAllCampaigns);
router.post("/schedule", userAuth, compainCtrl.sendCampaign);
router.post("/triger-schedule/:campaignId", userAuth, compainCtrl.triggerCampaignNow);
router.post("/test-campaign-scheduler/:campaignId", userAuth, compainCtrl.testTriggerCampaignNow);


module.exports = router;


