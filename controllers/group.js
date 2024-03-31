const Group = require('../models/group')
const User = require('../models/user')
const UserGroup = require('../models/usergroup')
const { Op, where } = require('sequelize');
const sequelize = require('../util/database')


exports.addGroup = async (req, res) => {
    const { groupName, emailArray } = req.body;
    const user = req.user;
    console.log(emailArray);
    
    const transaction = await sequelize.transaction(); // Start a transaction
    
    try {
        const users = await User.findAll({ where: { email: { [Op.in]: emailArray } } }, { transaction });

        const newGroup = await Group.create({ groupname: groupName, creatorId: user.id }, { transaction });
        
        const userGroups = await UserGroup.create({ role: 'admin', username: user.name, groupname: newGroup.groupname, userId: user.id, groupId: newGroup.id }, { transaction });
        
        for (const user of users) {
            await UserGroup.create({ role: 'member', username: user.name, groupname: newGroup.groupname, userId: user.id, groupId: newGroup.id }, { transaction });
        }

        await transaction.commit(); // Commit the transaction
        res.status(201).json({ group: newGroup, userGroup: userGroups });
    } catch (err) {
        console.log(err);
        await transaction.rollback(); // Rollback the transaction if an error occurs
        res.status(500).json({ error: 'Internal server error', err: err });
    }
};

exports.getGroup = async (req, res) => {
    const user = req.user
    try{
        const usergroup = await UserGroup.findAll({where: {userId : user.id}})
        //console.log(usergroup)
        const groupIds = usergroup.map(group => group.groupId)
        //console.log(groupIds)
        const groups = await Group.findAll({where: {id: groupIds}})
        res.status(201).json({group: groups})
    }catch(err){
        console.log(err)
    }
}

exports.getGroupUsers = async (req, res) => {
    const groupId = req.query.groupid
    try{
        const groupusers = await UserGroup.findAll({where: {groupId: groupId}})
        res.status(201).json({groupusers: groupusers})
    }catch(err){
        console.log(err)
    }
}

exports.addAdmin = async (req, res) => {
    const {userId, groupId} = req.body
    console.log(userId, groupId)
    try{
        const adminuser = await UserGroup.update({role: 'admin'}, {where: {userId: userId, groupId: groupId}})
        const usergroup = await UserGroup.findAll({where: {groupId: groupId}})
        console.log(adminuser)
        res.status(201).json({adminuser: adminuser, usergroup : usergroup})
    }catch(err){
        console.log(err)
    }
}

exports.removeUser = async (req, res) => {
    const {userId, groupId} = req.body
    console.log(userId, groupId)
    try{
        const removeuser = await UserGroup.destroy({where: {userId: userId, groupId: groupId}})
        const usergroup = await UserGroup.findAll({where: {groupId: groupId}})
        console.log(removeuser)
        res.status(201).json({removeuser: removeuser, usergroup : usergroup})
    }catch(err){
        console.log(err)
    }
}

exports.addUserToGroup = async (req, res) => {
    const {groupId, groupName, email} = req.body
    try{
        const user = await User.findOne({where: {email: email}})
        console.log('user',user.id)
        if(!user){
            res.status(404).json({message: 'User not registered Please invite user', user: user})
        }
        const existingUserGroup = await UserGroup.findOne({ where: { userId: user.id, groupId: groupId } });
        console.log('existingUserGroup', existingUserGroup);
        
        if (existingUserGroup) {
            return res.status(409).json({ message: `User already added in ${groupName}` });
        } else {
            const addUser = await UserGroup.create({ role: 'member', username: user.name, groupname: groupName, userId: user.id, groupId: groupId });
            return res.status(201).json({ user: user, newuser: addUser });
        }
        
    }catch(err){
        console.log(err)
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

exports.checkAdminStatus = async (req, res) => {
    const {groupid} = req.query
    const user = req.user
    let isAdmin
    try{
        const adminstatus = await UserGroup.findOne({where: {userId: user.id, groupId: groupid}})
        console.log(adminstatus)
        if (adminstatus.role === 'admin'){
            isAdmin = true
        }else{
            isAdmin = false
        }
        res.status(201).json({isadmin: isAdmin})
        }catch(err){
        console.log(err)
        res.status(500).json({message: 'Internal Server Error'})
    }
}