var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const dishRouter = require('./routes/dishRouter')
const promoRouter = require("./routes/promoRouter")
const leaderRouter = require("./routes/leaderRouter")

const mongoose = require('mongoose')
const Dishes = require("./models/dishes")
const Promotions = require("./models/promotions")
const Leaders = require("./models/leaders")

const url = 'mongodb://localhost:27017/conFusion'
const connect = mongoose.connect(url);
connect.then((db)=>{
  console.log("Connected correctly to the server")
}, (err) => {console.log(err); });
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('12345-67890-09876-54321'));

const throwAuthError = (message) => {
  const err = new Error (message);
  err.status = 401;
  return err
}

const auth = (req,res,next) => {
  console.log(req.signedCookies);
  if (!req.signedCookies.user){
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.setHeader('WWW-Authenticate','Basic');
      return next(throwAuthError("You are not authenticated"));
    }
    const auth = new Buffer.from(authHeader.split(' ')[1],'base64').toString().split(":");
    //Take the second half from "Basic {BASE64_ENCODED_AUTH}"
    //Then Split the string with ':' as that separates the username and password
    //Buffers objects are used to represent a fixed length sequence of bytes -> subclass of the Uint8Array class
    //Buffer.from() handles some security concerns
    if (auth[0] !== "admin" || auth[1] !== "password"){
      res.setHeader('WWW-Authenticate','Basic');
      return next(throwAuthError("You are not authenticated"));
    }
    res.cookie('user','admin',{signed:true})
    next();
  }
  if (req.signedCookies.user === 'admin') next();
  else {
    res.setHeader('WWW-Authenticate','Basic');
    return next(throwAuthError("You are not authenticated"));
  }
}
app.use(auth)
//We want to validate our client auth before we serve up the static resources
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/dishes", dishRouter)
app.use("/promotions",promoRouter)
app.use("/leaders", leaderRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
