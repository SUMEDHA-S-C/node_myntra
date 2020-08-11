//used for authentication
const localStrategy = require("passport-local").Strategy; //immediate invoke
const bcryprt = require("bcryptjs");
const mongoose = require("mongoose");

//Load user schema for validation
let User = require("../Model/Auth");

module.exports = (passport) => {
  passport.use(
    new localStrategy({ usernameField: "email" }, (email, password, done) => {
      //find user database
      User.findOne({ email })
        .then((user) => {
          //check user exist or not
          if (!user) {
            return done(null, false, {
              message: "Email not registered!",
            });
          }
          //password verification
          bcryprt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, {
                message: "Invalid password! Please enter the valid password",
              });
            }
          });
        })
        .catch((err) => console.log(err));
    })
  );
  //session handling
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
