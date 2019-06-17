var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

// ROOT ROUTE
router.get('/', function (req, res) {
    res.render("landing");
});

// Show register form Route
router.get("/register", function (req, res) {
    res.render("register");
});

// handle signup logic
router.post("/register", function (req, res) {
    var newUser = new User({
        username: req.body.username
    });
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function () {
            req.flash('success', "Hello " + user.username + ", " + "Welcome to Meditation Addict");
            res.redirect("/blogs");
        });
    });
});

//login form Route
router.get("/login", function (req, res) {
    res.render('login')
});

//handles login logic
router.post("/login", passport.authenticate("local", {
    successRedirect: "/blogs",
    failureRedirect: "/login"
}), function (req, res) {});

//Logout logic Route
router.get("/logout", function (req, res) {
    req.logout();
    req.flash("success", "You have Logged out!");
    res.redirect("/blogs");
});

module.exports = router;