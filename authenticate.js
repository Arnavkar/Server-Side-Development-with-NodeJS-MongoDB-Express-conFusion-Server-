//Auth strategies
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/users')

//If we are not using passport-local-mongoose -> we must provide our own authentication function
// eg. the one we used in the last commit
exports.local = passport.use(new LocalStrategy(User.authenticate()));

//Required for Session support -> why exactly??
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
