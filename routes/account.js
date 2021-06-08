const router = require("express").Router();
const passport = require("passport");
const { validateUserInfo } = require("./utils/validate");
const mongoose = require("mongoose");
const { DATABASEURL, OPTIONS } = require("../config/mongo.config.js");
const User = require("../models/m_user.js");
const hash = require("../config/hash.js");

router
  .route("/login")
  .get((req, res) => {
    res.render("auth/login.ejs", { error: req.flash("notFoundUser")[0] });
  })
  .post(
    passport.authenticate("emailAndPasswordStrategy", {
      successRedirect: "/",
      failureRedirect: "/account/login",
      failureFlash: true,
    })
  );

router
  .route("/signup")
  .get((req, res) => {
    res.render("auth/signup.ejs", { error: undefined, username: "", email: "" });
  })
  .post(async (req, res) => {
    const validateError = validateUserInfo(req.body);
    if (validateError) {
      res.render("auth/signup.ejs", { error: validateError, username: req.body.username, email: req.body.email });
      return;
    }
    const data = {
      username: req.body.username,
      email: req.body.email,
      password: hash.digest(req.body.password),
    };
    await mongoose.connect(DATABASEURL, OPTIONS);
    const db = mongoose.connection;
    User.create({ ...data })
      .then((user) => {
        req.login(user, (err) => {
          if (err) {
            throw err;
          }
          res.redirect("/");
        });
      })
      .catch((err) => {
        if (err.errors) {
          res.render("auth/signup.ejs", {
            error: { notUniqueEmail: err.errors.email },
            username: req.body.username,
            email: req.body.email,
          });
          return;
        }
        throw err;
      })
      .then(() => db.close());
  });

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/account/login");
});

module.exports = router;
