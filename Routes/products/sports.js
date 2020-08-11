//ROUTER LEVEL MIDDLEWARE
const express = require("express");
const router = express.Router();

//@ http method GET
//@description its profile get information
//@acses PUBLIC
router.get("/", (req, res) => {
  res.send("I am sports router");
});

module.exports = router;
