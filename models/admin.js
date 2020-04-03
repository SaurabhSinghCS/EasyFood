var mongoose = require('mongoose')
var passportLocalMongoose = require('passport-local-mongoose')

var UserSchema = new mongoose.Schema({
    username:String,
    name:String,
    email:String,
    mobile:String,
    password:String,
    date_account_formed:{
        type:Date,
        default:Date.now
    }
});

UserSchema.plugin(passportLocalMongoose);
  
module.exports = mongoose.model("admin",UserSchema);