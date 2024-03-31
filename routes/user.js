const express = require('express');

const router = express.Router();

const userController = require('../controllers/user');

router.post('/user/signup', userController.createUser);

router.post('/user/login', userController.userLogin)

router.post('/user/search-user',userController.userSearch)


module.exports = router