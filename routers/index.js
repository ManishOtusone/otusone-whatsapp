const express = require('express');
const router = express.Router();


const admin = require('./admin');
router.use('/otusone/admin', admin);


const user = require('./user');
router.use('/otusone/user', user);

const template = require('./metaTemplate');
router.use('/otusone/wa-meta', template);


const contact = require('./contact');
router.use('/otusone/contact', contact);


const compaign = require('./campaign');
router.use('/otusone/campaign', compaign);

const templateMessage = require('./templateMessage');
router.use('/otusone/template-message', templateMessage);

const reports = require('./reportsAnalitics');
router.use('/otusone/reports', reports);



const meta = require('./metaAuth');
router.use('/otusone/meta', meta);  


const tag = require('./tag');
router.use('/otusone/tag', tag);  

const webhook = require('./webhook');
router.use('/otusone/webhook', webhook);  

const livechat = require('./message');
router.use('/otusone/livechat', livechat); 


const metaFlows = require('./flows');
router.use('/otusone/meta-flows', metaFlows); 


const chatbot = require('./chatbot');
router.use('/otusone/meta-chatbot', chatbot); 

const subscription = require('./subscription');
router.use('/otusone/subscription', subscription); 


const checkout = require('./checkout');
router.use('/otusone/checkout', checkout); 

const intigration = require('./integration');
router.use('/otusone/intigration', intigration); 


const waLink = require('./waLink');
router.use('/otusone/wa-link', waLink); 

const widget = require('./widget');
router.use('/otusone/wa-widget', widget); 

module.exports = router;
