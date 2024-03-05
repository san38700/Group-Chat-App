const express = require('express');

const router = express.Router();

const groupChatController = require('../controllers/user');

router.post('/user/signup', groupChatController.createUser);




module.exports = router