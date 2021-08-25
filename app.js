const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const passport = require('passport');
const config = require('./config')

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/userRouter');
const dishRouter = require('./routes/dishRouter')
const promoRouter = require("./routes/promoRouter")
const leaderRouter = require("./routes/leaderRouter")
const uploadRouter = require("./routes/uploadRouter");

const mongoose = require('mongoose')

const url = config.mongoUrl; 
const connect = mongoose.connect(url);
connect.then((db)=>{
  console.log("Connected correctly to the server")
}, (err) => {console.log(err); });
let app = express();

//redirect all requests from http to https
app.all('*',(req,res,next) => {
  //If incoming request has the secure flag, we know it is hitting the secure port already 
  if (!req.secure) res.redirect(307,'https://' + req.hostname + ':' + app.get('secPort') + req.url);
  else return next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser('12345-67890-09876-54321')); // secret key provided
// app.use(session({
//   name: 'session-id',
//   secret:'12345-67890-09876-54321',
//   saveUninitialized:false,
//   resave:false,
//   store:new FileStore()
// }));
app.use(passport.initialize());
app.use(passport.session())

//We can remove the auth procedure from the overall application by specifying which routes require authentication inside of the router file 
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use(express.static(path.join(__dirname, 'public')));

app.use("/dishes", dishRouter);
app.use("/promotions",promoRouter);
app.use("/leaders", leaderRouter);
app.use("/imageUpload", uploadRouter);

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
