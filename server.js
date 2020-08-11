const express = require("express");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const Handlebars = require("handlebars");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const { connect } = require("mongoose"); //destructuring
const { PORT, MONGODB_URL } = require("./config"); //no nedd to provide index.js by default it will take

const app = express();
//import localPassport
require("./config/passport")(passport);

//========================= CONNECT MONGOBD DATABASE  ===========================
connect(
  MONGODB_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) throw err;
    console.log("Database Connection successful");
  }
);
//========================= CONNECT MONGOBD DATABASE  ===========================

//================= TEMPLATE ENGINE MIDDLEWARE STARTS HERE  =====================
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");
//================= TEMPLATE ENGINE MIDDLEWARE ENDS HERE  =======================

//handlebars helperclasses
Handlebars.registerHelper("removeFirst6Char", (str) => {
  let TrimString = [...str].splice(6).join("");
  return new Handlebars.SafeString(TrimString);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//=================== METHOD-OVERRIDE MIDDLEWARE ==================
app.use(methodOverride("_method"));

//============= session and connect-flash middlewares starts here ==============
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(flash());
//============= session and connect-flash middlewares ends here ==============

//==========PASSPORT MIDDLEWARE STARTS HERE==============
app.use(passport.initialize());
app.use(passport.session());
//==========PASSPORT MIDDLEWARE ENDS HERE==============

//========== SET GLOBAL VARIABLES--> THIS VARIABLES CAN BR ACCESSED FROM ENTIRE APPLICATIONS ==========
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.warning_msg = req.flash("warning_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});

//=================== SERVER STATIC ASSETS  ===================

app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/node_modules"));

//=================== SERVER STATIC ASSETS  ===================

app.get("/", (req, res) => {
  res.render("./home");
});

//================  load ROUTES module  =====================
app.use("/profile/", require("./Routes/profiles/profile"));
app.use("/auth/", require("./Routes/auth/auth"));
app.use("/sports", require("./Routes/products/sports"));
//================  load ROUTES module  =====================

app.listen(PORT, (err) => {
  if (err) throw err;
  console.log("Myntra server is running on port number " + PORT);
});
