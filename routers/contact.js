const express = require("express");
const router = express.Router();
const contactCtrl = require("../controllers/contact");
const {userAuth} = require("../middlewares/auth");

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [".csv", ".xlsx", ".xls"];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only .csv, .xlsx, .xls files are allowed"));
  }
};

const upload = multer({ storage, fileFilter });


router.post("/import-contact-file",userAuth,upload.single("file"),contactCtrl.importContactsFromFile);

router.post("/add-single-contact", userAuth, contactCtrl.addContactManually);
router.post("/import", userAuth, contactCtrl.importContactsAndSaveToList);
router.get("/list", userAuth, contactCtrl.getContacts);

router.get("/group", userAuth, contactCtrl.getAllContactGroups);
router.get("/list-by-group/:groupId", userAuth, contactCtrl.getContactListByGroupId);


router.post("/filter-contact", userAuth, contactCtrl.filterContacts);



module.exports = router;


