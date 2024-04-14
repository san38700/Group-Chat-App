const Group = require('../models/group')
const User = require('../models/user')
const UserGroup = require('../models/usergroup')
const { Op, where } = require('sequelize');
const sequelize = require('../util/database')
const s3services = require('../s3services/s3services')
const Chat = require('../models/chat')
const fs = require('fs');
const io = require('../app.js')

exports.multimediaFiles = async(req, res) => {
    const user = req.user
    console.log(req.body)
    const file = req.file; // Uploaded file object
    const fileName = req.file.originalname; // Get the file name
    const fileData = fs.readFileSync(file.path);
    const groupId = req.body.groupId
    console.log('groupid',groupId)
    const AWSfileName = `CA${user.id}${groupId}${Date.now()}_${fileName}`
    console.log(AWSfileName)
    // You can now use the file and fileName variables as needed
    console.log('Uploaded file:', file);
    console.log('File name:', fileName);
    
    try{     
        const fileURL = await s3services.uploadToS3(process.env.BUCKET_NAME, fileData, AWSfileName);
        

        fs.unlinkSync(file.path);


        res.status(201).json({ fileName, fileURL, success: true });
    }catch(err){
        console.log(err)
    }
};
