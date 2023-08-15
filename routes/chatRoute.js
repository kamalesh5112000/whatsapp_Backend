const express = require('express');
const userAuthenticate=require('../middleware/auth');
const ChatController=require('../controllers/chatController');

const router= express.Router();

const multer = require("multer");
const handleMultiparts = multer();

router.get('/getmsg',userAuthenticate.authenticate,ChatController.getchats);
router.post('/addmsg',userAuthenticate.authenticate,ChatController.addChat);
router.post("/sendfile", handleMultiparts.single("myfile"), userAuthenticate.authenticate, ChatController.sendFile);

module.exports = router;