const express = require('express');
const router = express.Router();
const {userAuth} = require('../middlewares/auth');
const tagCtrl=require("../controllers/tag")

router.post('/create-new', userAuth, tagCtrl.createTag);
router.get('/all',userAuth, tagCtrl.getTagsByUser);
router.get('/categories',userAuth, tagCtrl.getUniqueTagCategories);
router.patch('/edit/:tagId',userAuth, tagCtrl.editTag);
router.delete('/delete/:tagId',userAuth, tagCtrl.deleteTag);

module.exports = router;
