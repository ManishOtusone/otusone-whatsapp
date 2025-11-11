const express = require('express');
const router = express.Router();
const {userAuth} = require('../middlewares/auth');
const metaTemplateCtrl= require('../controllers/metaTemplate');




router.get('/templates', userAuth, metaTemplateCtrl.getTemplates);
router.get('/templates-details/:templateId', userAuth, metaTemplateCtrl.getTemplateById);
router.post('/templates', userAuth, metaTemplateCtrl.createTemplate);
router.delete('/templates', userAuth, metaTemplateCtrl.deleteTemplate);


module.exports = router;
