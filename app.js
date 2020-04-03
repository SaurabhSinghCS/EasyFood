var mongoose = require("mongoose");
var passport = require("passport");
var bodyParser = require("body-parser");
var User = require("./models/user");
var admin = require("./models/admin");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
let cookieParser = require('cookie-parser');


const express = require('express');
const app = express();
const http = require('http').Server(app);


mongoose.connect("mongodb://localhost/food_app", function (err, db) {
    if (!(err)) console.log("you are connected to mongodb");
    if(err) console.log('not connected to mongodb');
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(require("express-session")({
    secret: "Rusty is the best og in the world",
    resave: false,
    saveUninitialized: false
}));

var db=mongoose.connection; 
db.on('error', console.log.bind(console, "connection error")); 
db.once('open', function(callback){ 
    console.log("connection succeeded"); 
})

var items=db.collection('food_item');
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

app.set('view engine', 'ejs');
//
app.use(passport.initialize());
app.use(passport.session());

// 
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// feedback from / or starting page
app.post('/', function(req,res){ 
    var Name = req.body.Name; 
    var email =req.body.email; 
    var phonenumber = req.body.phonenumber; 
    var text =req.body.text;
    var data = { 
        "Name": Name, 
        "email":email, 
        "phonenumber":phonenumber, 
        "text":text 
    } 
db.collection('details').insert(data,function(err, collection){ 
        if (err) throw err; 
        console.log("Record inserted Successfully");
              
    }); 
          
    return res.redirect('/'); 
})

// feedback from logedin page
app.post('/in', function(req,res){ 
    var Name = req.body.Name; 
    var email =req.body.email; 
    var phonenumber = req.body.phonenumber; 
    var text =req.body.text;
    var data = { 
        "Name": Name, 
        "email":email, 
        "phonenumber":phonenumber, 
        "text":text 
    } 
db.collection('details').insert(data,function(err, collection){ 
        if (err) throw err; 
        console.log("Record inserted Successfully");
              
    }); 
          
    return res.redirect('/in'); 
})

//for main page
app.get("/", function (req, res) {
    items.find().sort({catagories : -1}).toArray(function(err,data){
        if(err) throw err;
        res.render("index",{data:data});
        console.log(data)
    });
});


//handling user sign up
app.post("/register", function (req, res) {
    User.register(new User({ username: req.body.username,email: req.body.email,name: req.body.name }),req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            return res.render('/register');
        } //user stragety
        passport.authenticate("local")(req, res, function () {
            console.log(req.body.name)
            console.log(req.body.username)
            console.log(req.body.email)
            res.redirect("/in"); //once the user sign up
        });
    });
});


// after login
app.get("/in",isLoggedIn, function (req, res) {
    items.find().sort({catagories : -1}).toArray(function(err,data){
        if(err) throw err;
        res.render("in",{data:data,user: req.user});
        console.log(req.user);
    });
});
app.get("/",isLoggedIn, function (req, res) {
    res.redirect('/in');
});


// Login Routes
app.post("/login", passport.authenticate("local", {
    successRedirect: "/in",
    failureRedirect: "/"
}), function (req, res) {
    res.send("User is " + req.user.id);
});

app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
});

app.get("/in/profile",function(req, res){
    console.log(req.user)
    res.render("profile.ejs",{user: req.user})
})

// profile edit
app.get("/in/profileedit",function(req, res){
    res.render("profileedit",{user: req.user})
})

app.post("/in/profileedit",function(req, res){
    var id=req.user._id
    if((req.body.gender != req.user.gender) && (req.body.gender != null)){
    var gender=req.body.gender
    User.updateOne({'_id':id},{$set:{'gender': gender}},function(err, res){
        if(err){ throw err}
        console.log("gender updated")
    })
}
else if(req.body.gender == null){
    console.log("gender not changed")
}
if((req.body.dob != req.user.dob) && (req.body.dob != null)){
    var dob=req.body.dob
    User.updateOne({'_id':id},{$set:{'dob': dob}},function(err, res){
        if(err){ throw err}
        console.log("dob updated")
    })      
}
else if(req.body.dob == null){
    console.log("gender not changed")
}
if((req.body.address != req.user.address) && ((req.body.address != null) || (req.body.address != ''))){
    var address=req.body.address
    User.updateOne({'_id':id},{$set:{'address': address}},function(err, res){
        if(err){ throw err}
        console.log("address updated")
    })
}
else if(req.body.address == null){
    console.log("address not changed")
}
if((req.body.mobile != req.user.mobile) && (req.body.mobile != null)){
    var mobile=req.body.mobile
    User.updateOne({'_id':id},{$set:{'mobile': mobile}},function(err, res){
        if(err){ throw err}
        console.log("mobile updated")
    })
}
else if(req.body.mobile == null){
    console.log("mobile not changed")
}
if((req.body.country != req.user.country) && (req.body.country != null)){
    var country=req.body.country
    User.updateOne({'_id':id},{$set:{'country': country}},function(err, res){
        if(err){ throw err}
    })
}
else if(req.body.country == null){
    console.log("country not changed")
}
if((req.body.bio != req.user.bio) && ((req.body.bio != '') || (req.body.bio != null))){
    var bio=req.body.bio
    User.updateOne({'_id':id},{$set:{'bio': bio}},function(err, res){
        if(err){ throw err}
        console.log("bio updated")
    })
}
else if(req.body.bio == null || req.body.bio == ''){
    console.log("bio not changed")
}
    res.redirect("/in/profile")
})

app.get("/in1",function(req, res){
    res.render("in",{name: req.user.username});
    console.log(req.user.username);
})

app.post("/in1", function(req, res){
    var id=req.user._id
    var price=req.body.price
    console.log(price)
    if(price == 0){
        res.redirect("/in")
    }
    else{
    User.updateOne({'_id':id},{$set:{'price': price}},function(err, res){
        if(err) throw err
        console.log("payment updated")
    })
    console.log(req.user)
    res.redirect("/payment")
}
})
app.post('/admin_register',function(req,res){
    admin.register(new admin({ username: req.body.username,email: req.body.email,name: req.body.name,mobile: req.body.mob_number }),req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            return res.render('/admin_register');
        } //admin stragety
        passport.authenticate("local")(req, res, function () {
            console.log(req.body.name)
            console.log(req.body.username)
            console.log(req.body.email)
            res.redirect("/admin_login"); //once the user sign up
        });
    });
});
app.post("/admin_login", passport.authenticate("local", {
    successRedirect: "/admin",
    failureRedirect: "/admin_login"
}), function (req, res) {
    res.send("User is " + req.user.id);
});

app.get('/admin_register',function(req, res){
    res.render("admin_log_sign",{a:'register'})
});

app.get('/admin_login',function(req, res){
    res.render("admin_log_sign",{a:'login'})
})
app.get('/admin',function(req,res){
    res.render("admin_panel")
})

app.get("/payment",function(req, res){
    console.log(req.user)
    res.render("payment",{user:req.user})
})

app.get("/in/cart",function(req,res){
    res.render("cart");
})

app.get("/info/",function(req, res){
    res.render("info")
})

app.get('/admin/add_item',function(req, res){
    res.render('add_item');
});
app.post('/add_item_cart',function(req, res){
    var Imageurl = req.body.Imageurl;
    var FoodItem =req.body.Item_name; 
    var HotelAddress = req.body.Hotel_address; 
    var catagories =req.body.Catagories;
    var Price=req.body.Price;
    var Added_by=req.admin;
    var data = { 
        "Imageurl": Imageurl, 
        "FoodItem":FoodItem, 
        "HotelAddress":HotelAddress, 
        "catagories":catagories,
        "Price":Price,
        "Added_by":Added_by 
    } 
    items.insert(data,function(err, collection){ 
        if (err) throw err; 
        console.log("Record inserted Successfully");
        console.log(data);
              
    }); 
          
    return res.redirect('/admin/add_item'); 
})

// item selected from user added to the users area
app.post("/item_selected",function(req,res){
    var user = req.body.user_id;
    var item_selected_user = req.body.food_item_selected;
    User.updateOne({'_id':user},{$s:{'price': price}})
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/in");
}

const server = http.listen(8081, function () {
    console.log('listening on *:8081');
});

module.exports=User;
module.exports=mongoose;