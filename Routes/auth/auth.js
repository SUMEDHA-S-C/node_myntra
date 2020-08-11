//ROUTER LEVEL MIDDLEWARE
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");

const User = require("../../Model/Auth");

//Loading auth model

//@ http method GET
//@description its profile get information
//@acses PUBLIC

//==================== LOGIN GET ROUTE  ======================
router.get("/login", (req, res) => {
  res.render("./auth/login");
});

//==================  REGISTER GET ROUTE  =====================
router.get("/register", (req, res) => {
  res.render("./auth/register");
});

//@ http method POST
//@description LOGIN AUTHENTICATION
//@acses PUBLIC
//==================== LOGIN POST ROUTE  ======================
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/profile/all-profiles",
    failureRedirect: "/auth/login",
    failureFlash: true,
  })(req, res, next);
});

//==================  REGISTER POST ROUTE  =====================
router.post("/register", (req, res) => {
  //server side validation
  const errors = [];
  let { username, email, password, confirm_password } = req.body;
  if (password != confirm_password) {
    errors.push({ text: "Password should match" });
  }
  if (password.length < 6) {
    errors.push({ text: "Password should be minimum 6 characters" });
  }
  if (errors.length > 0) {
    res.render("./auth/register", {
      errors,
      username,
      email,
      password,
      confirm_password,
    });
  } else {
    User.findOne({ email })
      .then((user) => {
        if (user) {
          req.flash(
            "error_msg",
            "Email id already exists please use another address"
          );
          res.redirect("/auth/register", 401, {});
        } else {
          let newUser = new User({
            username,
            email,
            password,
          });
          // Make password hashed
          bcrypt.genSalt(12, (err, salt) => {
            //12 is encrypt size
            if (err) throw err;
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser
                .save()
                .then((user) => {
                  req.flash("success_msg", "Successfully registered");
                  res.redirect("/auth/login", 201, { user });
                })
                .catch((err) => console.log(err));
            });
          }); //done hashing
        }
      })
      .catch((err) => console.log(err));
  }
});

//=============== LOGOUT ==================
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "Logged out successfully");
  res.redirect("/auth/login", 201, {});
});
module.exports = router;
