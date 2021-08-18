const express = require("express")
const bodyParser = require('body-parser')
const Users = require('../models/users')

const router = express.Router()
router.use(bodyParser.json())

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.post('/signup',(req,res,next) => {
  Users.findOne({username:req.body.username})
  .then((user)=>{
    if(user!=null){
      var err = new Error ('User ' + req.body.username + ' already exists');
      err.status = 403;
      next(err);
    } else {
    return Users.create({
      username: req.body.username,
      password: req.body.password });
    }
  })
  .then((user)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type','application/json');
    res.json({status:"Registration Successfull",user: user})
  }), (err) => next(err)
  .catch((err)=>next(err));
});

router.post('/login',(req,res,next) => {
  if (!req.session.user){
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      const err = new Error("You are not authenticated")
      res.setHeader('WWW-Authenticate','Basic');
      err.status = 401;
      return next(err);
    }

    const auth = new Buffer.from(authHeader.split(' ')[1],'base64').toString().split(":");
    //Take the second half from "Basic {BASE64_ENCODED_AUTH}"
    //Then Split the string with ':' as that separates the username and password
    //Buffers objects are used to represent a fixed length sequence of bytes -> subclass of the Uint8Array class
    //Buffer.from() handles some security concerns
    Users.findOne({username:auth[0]})
    .then((user)=>{
      if (user === null){
        const err = new Error("You are not a registered user, User " + auth[0] + " does not exist");
        err.status = 403;
        return next(err);
      }
      else if(user.password!==auth[1]){
        const err = new Error("Incorrect Password!");
        err.status = 403;
        return next(err);
      }
      else if (user.username === auth[0] && user.password === auth[1]) {
            //res.cookie('user','admin',{signed:true})
            req.session.user = 'authenticated';
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');
            res.end('You are authenticated!')
          }
    })
    .catch((err)=>next(err));
  }
  else {
    res.statusCode = 200;
    res.setHeader('Content-Type','text/plain');
    res.end('You are already authenticated');
  }
})

router.get('/logout',(req,res,next) => {
  if (req.session){
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  } else {
    var err = new Error("You are not logged in");
    err.status = 403;
    next(err);
  }
});
module.exports = router;
