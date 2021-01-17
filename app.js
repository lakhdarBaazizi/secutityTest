//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require("md5");
const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect("mongodb://localhost:27017/userdb", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});
const User = mongoose.model("User", userSchema);

app.get("/", (req, res) => {
    res.render('home');
});
app.route("/register")
    .post((req, res) => {
        const newUser = new User({
            email: req.body.username,
            password: md5(req.body.password)
        });
        newUser.save((err) => {
            if (err) {
                console.log(err)
            } else {
                res.render("secrets");
            }
        });
    }).get((req, res) => {
        res.render('register');
    });



app.route("/login")
    .get((req, res) => {
        res.render('login');
    })
    .post((req, res) => {
        User.findOne({
            email: req.body.username,
            password: md5(req.body.password)
        }, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                if (result) {
                    console.log(result);
                    res.render("secrets");
                }
            }
        })
    });










app.listen(3000, () => console.log("server running at 3000"));