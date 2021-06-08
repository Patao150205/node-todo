const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/m_user.js");
const mongoose = require("mongoose");
const { DATABASEURL, OPTIONS } = require("../config/mongo.config.js");
const { digest } = require("./hash.js");

passport.use(
  "emailAndPasswordStrategy",
  new LocalStrategy({ usernameField: "email", passReqToCallback: true }, async (req, email, password, done) => {
    await mongoose.connect(DATABASEURL, OPTIONS);
    const db = mongoose.connection;
    User.findOne({
      email,
      password: digest(password),
    })
      .then((user) => {
        if (!user) {
          done(null, false, req.flash("notFoundUser", "メールアドレス または パスワードが間違っています。"));
          return;
        }
        req.session.regenerate(() => {
          done(null, user);
        });
      })
      .catch((err) => {
        done(err);
      })
      .then(() => db.close());
  })
);

passport.serializeUser((user, done) => {
  done(null, user.email);
});

passport.deserializeUser(async (email, done) => {
  await mongoose.connect(DATABASEURL, OPTIONS);
  const db = mongoose.connection;
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        done(null, false);
        return;
      }
      done(null, user);
    })
    .catch((err) => {
      done(err);
    })
    .then(setImmediate(() => db.close()));
});

const initialize = () => {
  return [passport.initialize(), passport.session()];
};

const authorized = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/account/login");
  }
};

module.exports = {
  initialize,
  authorized,
};
