//Auth strategies
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/users');

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');

const FacebookTokenStrategy = require('passport-facebook-token');
const config = require('./config');

//If we are not using passport-local-mongoose -> we must provide our own authentication function
// eg. the one we used in the last commit
exports.local = passport.use(new LocalStrategy(User.authenticate()));
//Required for Session support -> why exactly??
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = (user) => {
  return jwt.sign(user,config.secretKey,{expiresIn:3600}); //Helps to sign and issue the signed token
  //Will expire in 3600 seconds
};

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts,
    (jwt_payload, done) => {
        console.log("JWT payload: ", jwt_payload);
        User.findOne({_id: jwt_payload._id}, (err, user) => {
            if (err) {
                return done(err, false);
            }
            else if (user) {
                return done(null, user);
            }
            else {
                return done(null, false);
            }
        });
    }));

exports.verifyUser = passport.authenticate('jwt', {session: false});
exports.verifyAdmin = (req,res,next) => {
    if (req.user.admin === true) return next();
    else {
        var err = new Error ("You are not authorized to perfom this operation!");
        err.status = 403;
        return next(err);
    }
}

exports.facebookPassport = passport.use(new FacebookTokenStrategy(
    {
        clientID: config.facebook.clientId,
        clientSecret: config.facebook.clientSecret
    },(accessToken, refreshToken, profile, done) => {
        User.findOne({facebookId: profile.id}, (err,user) => {
            if (err) return done(err,false);
            if (!err && user !== null) return done(null,user);
            else{
                user = new User({username: profile.displayName });
                user.facebookId = profile.id;
                user.firstname = profile.name.givenName;
                user.lastname = profile.name.familyName;
                user.save((err,user) => {
                    if (err) return done(err, false);
                    else return done(null,user);
                });
            }
        });
    }
));