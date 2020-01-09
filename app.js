require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require("md5");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

const userSchema = new mongoose.Schema({
    tittle: String,
    password: String
});




const User = mongoose.model("User", userSchema);

app.get("/", function (req, res) {
    res.render("home")
});

app.get("/login", function (req, res) {
    res.render("login")
});

app.get("/register", function (req, res) {
    res.render("register")
});

app.post("/register", function (req, res) {
    const newUser = new User({
        tittle: req.body.username,
        password: md5(req.body.password)
    });
    newUser.save(function (err) {
        if(err){
            res.render(err)
        } else {
            res.render("secrets")
        }
    })
});

app.post("/login", function (req, res) {
    User.findOne({ tittle: req.body.username}, function (err, userFound) {
            if(userFound.password === md5(req.body.password)){
                res.render("secrets")
            }else {
                res.send("There no such user or wrong password!")
            }
    })
});



app.listen(3000, function() {
    console.log("Server started on port 3000");
});