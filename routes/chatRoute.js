const express = require('express');
const userAuthenticate=require('../middleware/auth');
const ChatController=require('../controllers/chatController');

const router= express.Router();

router.get('/getmsg',userAuthenticate.authenticate,ChatController.getchats);
router.post('/addmsg',userAuthenticate.authenticate,ChatController.addChat);


module.exports = router;