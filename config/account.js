const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/m_user.js");
const mongoose = require("mongoose");
const { DATABASEURL, OPTIONS } = require("../config/mongo.config.js");

passport.use(
  "emailAndPasswordStrategy",
  new LocalStrategy({ usernameField: "email", passReqToCallback: true }, async (req, email, password, done) => {
    await mongoose.connect(DATABASEURL, OPTIONS);
    const db = mongoose.connection;
    db.on("error", (err) => {
      throw err;
    });
    User.findOne({
      email,
      password,
    })
      .then((user) => {
        if (!user) {
          done(null, false, req.flash("メールアドレス または パスワードが間違っています。"));
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
  console.log("いえい" + user.email);
  done(null, user.email);
});

passport.deserializeUser(async (email, done) => {
  console.log("いえい" + email);
  await mongoose.connect(DATABASEURL, OPTIONS);
  const db = mongoose.connection;
  db.on("error", (err) => {
    throw err;
  });
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
    .then(() => db.close());
});

const initialize = () => {
  return [passport.initialize(), passport.session()];
};

module.exports = {
  initialize,
};
