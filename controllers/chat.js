const { where } = require('sequelize')
const Chat = require('../models/chat')
const User = require('../models/user')
const { Op } = require('sequelize');


exports.createChat = async (req, res) => {
    const { messageText } = req.body
    const user = req.user
    // console.log(messageText)
    // console.log(user)
    try{
        const chats = await Chat.create({message: messageText, userId: user.id })
        res.status(201).json({chats : chats})
    }catch (err){
        console.log(err)
    }
}

exports.getChats = async (req, res) => {
    try{
        var id = parseInt(req.query.lastMessageid) || undefined
        var oldmsg = req.query.oldmessage
        var fid = parseInt(req.query.firstMessageId)
        console.log(id)
        console.log(oldmsg)
        console.log(fid)
        if (id == undefined && fid && oldmsg)  {
            const chats = await Chat.findAll({
                include: User,
                where: {
                  id: {
                    [Op.lt]: fid 
                  }
                }
              });
            res.status(200).json({chats: chats})
        }else{
            id = -1
            const chats = await Chat.findAll({
                include: User,
                where: {
                  id: {
                    [Op.gt]: id 
                  }
                }
              });
            res.status(200).json({chats: chats})
        }
        // const chats = await Chat.findAll({where: {id: id},include : User})
        
    }catch(err){
        console.log(err)
    }
    
}