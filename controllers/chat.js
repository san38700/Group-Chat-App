const Chat = require('../models/chat')


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