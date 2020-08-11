//ROUTER LEVEL MIDDLEWARE
const express = require("express");
const router = express.Router();
const multer = require("multer");
const { ensureAuthenticated } = require("../../helper/auth_helper");

//load profile Schema model
const Profile = require("../../Model/Profile");

//load multer file
const { storage } = require("../../config/multer");
const upload = multer({ storage });

//@ http method GET
//@description: its profile get information
//@acses PUBLIC
router.get("/", (req, res) => {
  res.send("I am profile router");
});

router.get("/create-profile", ensureAuthenticated, (req, res) => {
  res.render("./profiles/create-profile");
});

router.get("/all-profiles", (req, res) => {
  //find profile collections and fetc data from that collections
  Profile.find({})
    .sort({ date: "desc" })
    .lean()
    .then((profile) => {
      res.render("./profiles/all-profiles", { profile });
    })
    .catch((err) => console.log(err));
});

//========================  GET USER-DETAILS  =====================
router.get("/user-details/:id", (req, res) => {
  Profile.findOne({ _id: req.params.id })
    .lean()
    .then((profile_detail) => {
      res.render("./profiles/user-profiles", { profile_detail });
    })
    .catch((err) => console.log(err));
});
//========================  GET USER-DETAILS  =====================

//========================  EDIT PROFILE  ==========================
router.get("/edit-profile/:id", ensureAuthenticated, (req, res) => {
  Profile.findOne({ _id: req.params.id })
    .lean()
    .then((edit_profile) => {
      res.render("./profiles/edit-profile", { edit_profile });
    })
    .catch((err) => console.log(err));
});

//@ http method POST
//@description: To create profile data
//@acses PRIVATE

router.post(
  "/create-profile",
  ensureAuthenticated,
  upload.single("photo"),
  (req, res) => {
    let {
      firstname,
      lastname,
      designation,
      phone,
      skills,
      address,
      alt_address,
      gender,
      country,
      landmark,
      pincode,
    } = req.body;

    let newProfile = {
      photo: req.file,
      firstname,
      lastname,
      designation,
      phone,
      skills,
      address,
      alt_address,
      gender,
      country,
      landmark,
      pincode,
    };

    new Profile(newProfile)
      .save()
      .then((profile) => {
        req.flash("success_msg", "Profile created successfully");
        res.redirect("/profile/all-profiles", 201, { profile });
      })
      .catch((err) => console.log(err));
  }
);

//@ http method PUT
//@description: updating profile data
//@acses PRIVATE

router.put(
  "/edit-profile/:id",
  ensureAuthenticated,
  upload.single("photo"),
  (req, res) => {
    //If we need to mdify existing data or information, first should find data in DB by using findOne() method
    Profile.findOne({ _id: req.params.id })
      .then((update_profile) => {
        update_profile.photo = req.file;
        update_profile.firstname = req.body.firstname;
        update_profile.lastname = req.body.lastname;
        update_profile.phone = req.body.phone;
        update_profile.gender = req.body.gender;
        update_profile.designation = req.body.designation;
        update_profile.address = req.body.address;
        update_profile.alt_address = req.body.alt_address;
        update_profile.skills = req.body.skills;
        update_profile.country = req.body.country;
        update_profile.landmark = req.body.landmark;
        update_profile.pincode = req.body.pincode;

        update_profile
          .save()
          .then((update) => {
            req.flash("success_msg", "Profile updated successfully");
            res.redirect("/profile/all-profiles", 201, { update });
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  }
);

//==================  DELETE METHOD  =========================
router.delete("/profile-delete/:id", ensureAuthenticated, (req, res) => {
  Profile.deleteOne({ _id: req.params.id })
    .then(() => {
      req.flash("success_msg", "Profile deleted successfully");
      res.redirect("/profile/all-profiles");
    })
    .catch((err) => console.log(err));
});

module.exports = router;
