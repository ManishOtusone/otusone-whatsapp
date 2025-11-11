const express = require('express');
const router = express.Router();
const flowController = require('../controllers/flows');
const {userAuth} = require('../middlewares/auth');


router.use(userAuth);

router.post('/save', flowController.saveFlow);
router.get('/', flowController.getFlows);
router.get('/:id', flowController.getFlowById);
router.delete('/:id', flowController.deleteFlow);

module.exports = router;
