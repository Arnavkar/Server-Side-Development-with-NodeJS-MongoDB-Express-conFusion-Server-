const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose')
//username and password will be automatically added

var userSchema = new Schema({
    admin:{
      type:Boolean,
      default:false
    },
},{
    timestamps: true
});
userSchema.plugin(passportLocalMongoose)
module.exports = mongoose.model('User', userSchema);
