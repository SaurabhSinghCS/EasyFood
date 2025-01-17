var mongoose = require('mongoose')
var passportLocalMongoose = require('passport-local-mongoose')

var UserSchema = new mongoose.Schema({
    username:String,
    name:String,
    email:String,
    country:String,
    gender:String,
    address:String,
    mobile:Number,
    dob:Date,
    bio:String,
    password:String,
    price:Number,
    date_account_formed:{
        type:Date,
        default:Date.now
    },
    cart:Array
});

UserSchema.plugin(passportLocalMongoose);
  
module.exports = mongoose.model("User",UserSchema);