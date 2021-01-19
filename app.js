//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(session({
    secret: "oursecret",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/userdb", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.set("useCreateIndex", true);

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});
userSchema.plugin(passportLocalMongoose);
const User = mongoose.model("User", userSchema);

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get("/", (req, res) => {
    res.render('home');
});

app.get("/logout", (req, res) => {
    req.logout();
    res.render('home');
});
app.route("/register")
    .post((req, res) => {
        User.register({
            username: req.body.username
        }, req.body.password, (err, user) => {
            if (err) {
                console.log(err);
                res.redirect("/register");
            } else {
                passport.authenticate("local")(req, res, () => {
                    res.redirect("/secrets");
                });
            }
        })
    }).get((req, res) => {
        res.render('register');
    });
app.get("/secrets", (req, res) => {
    if (req.isAuthenticated()) {
        res.render("secrets");
    } else {
        res.redirect("/register");
    }
})


app.route("/login")
    .get((req, res) => {
        res.render('login');
    })
    .post((req, res) => {
        const newUser = new User({
            username: req.body.username,
            password: req.body.password
        });

        req.login(newUser, (err) => {
            if(err) throw err;
            passport.authenticate("local")(req, res, () => {
                res.redirect("/secrets");
            });
        });

    });










app.listen(3000, () => console.log("server running at 3000"));