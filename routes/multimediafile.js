const express = require('express');

const router = express.Router();

const fileController = require('../controllers/multimediafile');
const userAuthentication = require('../controllers/authentication')
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Specify the directory where files will be stored
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Keep the original file name
    }
});

const upload = multer({storage: storage  }); // Define storage for uploaded files

router.post('/user/uploadfile',userAuthentication.userAuthentication,  upload.single('file'), fileController.multimediaFiles)



module.exports = router