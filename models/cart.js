const  mongoose = require('mongoose');
const Schema = mongoose.Schema;
const cart = new Schema({
    username:String,
    FoodItem:String,
    cost:String,
    HotelAddress:String,
    'Img url':String,
    quantity:Number
});
module.exports = mongoose.model('cart',cart);