const Group = require('../models/group')
const User = require('../models/user')
const UserGroup = require('../models/usergroup')
const { Op, where } = require('sequelize');
const sequelize = require('../util/database')

exports.addGroup = async (req, res) => {
    //let transaction
    const {groupName, emailArray} = req.body
    const user = req.user
    try{
        transaction = await sequelize.transaction()

        const users = await User.findAll({where: {email: {[Op.in]: emailArray}}})
        console.log(users[0].email)
        const newGroup = await Group.create({groupname: groupName, creatorId: user.id},{transaction})

        await newGroup.addUser(user.id, { through: { role: 'admin' }, transaction });
        for (const user of users) {
            await newGroup.addUser(user.id, { through: { role: 'member' }, transaction });
        }
        await transaction.commit();

        res.status(201).json({success:newGroup})
    }catch (err){
        // Rollback the transaction if an error occurs
        if (transaction) await transaction.rollback();
        console.log(err)
    }
}

exports.getGroup = async (req, res) => {
    const user = req.user
    try{
        const usergroup = await UserGroup.findAll({where: {userId : user.id}})
        const groupIds = usergroup.map(group => group.groupId)
        //console.log(groupIds)
        const groups = await Group.findAll({where: {id: groupIds}})
        res.status(201).json({group: groups})
    }catch(err){
        console.log(err)
    }
}
