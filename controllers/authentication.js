const jwt = require('jsonwebtoken');
const User = require('../models/user')

exports.userAuthentication = async (req, res, next) => {
    try{
        const token = req.header('Authorization')
        const user = jwt.verify(token, process.env.TOKEN_SECRET)
        console.log('userId>>>>', user.userId)

        User.findByPk(user.userId)
         .then(user => {
            req.user = user
            next()
         })
    }catch(err){
        console.log(err)
        res.status(401).json({success : false})
    }
}