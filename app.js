//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.set('strictQuery', false);

mongoose.connect('mongodb://127.0.0.1:27017/userDB', function(err){
   if (err) {
     console.log(err);
   }else {
     console.log("Connected to mongodb");
   }
});

const userSchema = new mongoose.Schema ({
	email: {
        type: String,
        required: [true, "Pasa el temail pa"]
    },
	password: {
    type: String,
    required: [true, "Pasa la paswor pa"]
    }
});


userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password']});

const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res){
    res.render("home");
});



app.route("/login")
.get(
    function(req, res){
        res.render("login");
    }
)

.post(
    function (req, res) {
        const username = req.body.username;
        const password = req.body.password;

        User.findOne({email: username}, function(err, foundUser){
            if(err){
                console.log(err);
            }else if(foundUser){
                if(foundUser.password === password){
                    res.render("secrets")
                }
            }
        });
    }
);

app.route("/register")
.get(
    function(req, res){
        res.render("register");
    }
)

.post(
    function (req, res) {
        const newUSer = new User({
            email: req.body.username,
            password: req.body.password
        });
        
        newUSer.save(function(err){
            if (err){
                console.log(err);
            }else{
                res.render("secrets");
            }
        });
    }
);







app.listen(3000, function() {
  console.log("Server started on port 3000");
});