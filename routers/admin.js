const express = require('express');
const router = express.Router();



const multer=require("multer");
const storage=multer.diskStorage({});
const upload=multer({storage});


// router.post('/create-new-manager',);


module.exports = router;
