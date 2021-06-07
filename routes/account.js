const router = require("express").Router();
const passport = require("passport");
const { validateUserInfo } = require("./utils/validate");
const mongoose = require("mongoose");
const { DATABASEURL, OPTIONS } = require("../config/mongo.config.js");
const User = require("../models/m_user.js");

router
  .route("/login")
  .get((req, res) => {
    res.render("auth/login.ejs", { error: req.flash("notFoundUser")[0] });
  })
  .post(
    passport.authenticate("emailAndPasswordStrategy", {
      successRedirect: "/",
      failureRedirect: "/account/login",
      successFlash: true,
      failureFlash: true,
    })
  );

router
  .route("/signup")
  .get((req, res) => {
    res.render("auth/signup.ejs", { error: undefined, username: "", email: "" });
  })
  .post(async (req, res, next) => {
    const error = validateUserInfo(req.body);
    if (error) {
      res.render("auth/signup.ejs", { error: error, username: req.body.username, email: req.body.email });
      return;
    }
    const data = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    };
    await mongoose.connect(DATABASEURL, OPTIONS);
    const db = mongoose.connection;
    User.create({ ...data })
      .then(() => {})
      .catch((err) => {
        throw err;
      })
      .then(() => db.close());
  });

router.get("/logout", (req, res) => {
  req.logout();
  delete req.session;
  res.clearCookie("connect.sid");
  console.log(req.cookies);
  res.redirect("/account/login");
});

module.exports = router;
