const express = require("express");
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        //callback -> first arg: error //second arg: dest folder
        cb(null, 'public/images');
    },
    filename:(req,file,cb)=>{
        cb(null, file.originalname)
    }
});

const imageFileFilter = (req, file, cb) => {
    //match extensions with reg expressions
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb (new Error ('You can only upload image files!'), false);
    }
    cb (null,true);
};

const upload = multer({
    storage:storage,
    fileFilter:imageFileFilter
});

const uploadRouter = express.Router()
//req.body is parsed via the bodyParser module
uploadRouter.use(bodyParser.json())

uploadRouter.route('/')
.get(authenticate.verifyUser, authenticate.verifyAdmin,(req,res,next)=>{
    res.statusCode = 403
    res.end('GET Operation not supported on /dishes')
})
.put(authenticate.verifyUser, authenticate.verifyAdmin,(req,res,next)=>{
    res.statusCode = 403
    res.end('PUT Operation not supported on /dishes')
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin,(req,res,next)=>{
    res.statusCode = 403
    res.end('DELETE Operation not supported on /dishes')
})
.post(authenticate.verifyUser, authenticate.verifyAdmin, upload.single('imageFile'), (req,res) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        //return the url where the image has been stored 
        res.json(req.file);
});

module.exports = uploadRouter;