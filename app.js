//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
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
        bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
            const newUser = new User({
                email: req.body.username,
                password: hash
            });
            newUser.save((err) => {
                if (err) {
                    console.log(err)
                } else {
                    res.render("secrets");
                }
            });
        })
    }).get((req, res) => {
        res.render('register');
    });



app.route("/login")
    .get((req, res) => {
        res.render('login');
    })
    .post((req, res) => {
        User.findOne({
            email: req.body.username
        }, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                if (result) {
                    bcrypt.compare(req.body.password, result.password, (err, hash) => {
                        if (hash) {
                            console.log(result);
                            res.render("secrets");
                        }
                    });
                }
            }
        })

    });










app.listen(3000, () => console.log("server running at 3000"));