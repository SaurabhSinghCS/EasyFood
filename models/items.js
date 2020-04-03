var  mongoose = require('mongoose');
var Schema = mongoose.Schema;
const cart = new Schema({
    FoodItem:String,
    Price:Number,
    HotelAddress:String,
    Img_url:URL,
    Catagories:String
});
module.exports = mongoose.model('cart',cart);
  
module.exports = mongoose.model("Product",prod);