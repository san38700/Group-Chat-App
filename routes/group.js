const express = require('express');

const router = express.Router();

const groupController = require('../controllers/group');
const userAuthentication = require('../controllers/authentication')

router.post('/user/newgroup',userAuthentication.userAuthentication, groupController.addGroup)
router.get('/group/getgroups',userAuthentication.userAuthentication, groupController.getGroup)

module.exports = router