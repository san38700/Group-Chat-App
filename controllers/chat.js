const Chat = require('../models/chat')
const User = require('../models/user')


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
        const chats = await Chat.findAll({include: User})
        res.status(200).json({chats: chats})
    }catch(err){
        console.log(err)
    }
    
}