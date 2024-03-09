const express = require('express');

const router = express.Router();

const chatController = require('../controllers/chat');
const userAuthentication = require('../controllers/authentication')

router.post('/user/chat', userAuthentication.userAuthentication, chatController.createChat);
router.get('/user/chats', userAuthentication.userAuthentication, chatController.getChats)

module.exports = router