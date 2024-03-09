const express = require('express');

const router = express.Router();

const chatController = require('../controllers/chat');
const userAuthentication = require('../controllers/authentication')

router.post('/user/chats', userAuthentication.userAuthentication, chatController.createChat);

module.exports = router