const express = require('express');

const router = express.Router();

const groupController = require('../controllers/group');
const userAuthentication = require('../controllers/authentication')

router.post('/user/newgroup',userAuthentication.userAuthentication, groupController.addGroup)
router.get('/group/getgroups',userAuthentication.userAuthentication, groupController.getGroup)
router.get('/group/getgroupsusers',groupController.getGroupUsers)
router.post('/group/addadmin',groupController.addAdmin)
router.post('/group/removeuser',groupController.removeUser)
router.post('/user/adduser-to-group', groupController.addUserToGroup)
router.get('/group/checkadminstatus', userAuthentication.userAuthentication, groupController.checkAdminStatus)

module.exports = router