const router = require("express").Router();
const mongoose = require("mongoose");
const { DATABASEURL, OPTIONS } = require("../config/mongo.config.js");
const Content = require("../models/m_content.js");
const { validateContent } = require("./utils/validate");
const { authorized } = require("../config/account.js");
const { ObjectId } = require("bson");

const initialData = {
  time: undefined,
  contentName: undefined,
};

function createSendData(body, _userId) {
  return {
    _userId: ObjectId(_userId),
    time: new Date(body.time),
    contentName: body.contentName,
  };
}

router
  .get("/regist", authorized, (req, res) => {
    res.render("content/regist-form.ejs", { data: initialData });
  })
  .post("/regist", authorized, (req, res) => {
    res.render("content/regist-form.ejs", { data: req.body });
  });

router.post("/regist/excute", authorized, async (req, res) => {
  const error = validateContent(req.body);
  if (error) {
    res.render("content/regist-form.ejs", { error, data: req.body });
    return;
  }
  await mongoose.connect(DATABASEURL, OPTIONS);
  const db = mongoose.connection;
  db.on("error", (err) => {
    throw err;
  });
  const data = createSendData(req.body, req.user.id);
  Content.create(data)
    .then(() => {
      res.redirect("/content/regist/complete");
    })
    .catch((err) => {
      if (err) {
        throw err;
      }
    })
    .then(() => db.close());
});

router.get("/regist/complete", authorized, (req, res) => {
  res.render("content/complete.ejs");
});

router.route("/regist/confirm").post(authorized, (req, res) => {
  const error = validateContent(req.body);
  if (error) {
    res.render("content/regist-form.ejs", { error, data: req.body });
    return;
  }
  res.render("content/confirm.ejs", { data: req.body });
});

module.exports = router;

router.post("/edit", authorized, async (req, res) => {
  await mongoose.connect(DATABASEURL, OPTIONS);
  const db = mongoose.connection;
  Content.findById(req.body.editBtn)
    .then((doc) => {
      res.render("content/edit-form.ejs", { data: doc });
    })
    .catch((err) => {
      throw err;
    })
    .then(() => db.close());
});

router.post("/edit/excute", authorized, async (req, res) => {
  const error = validateContent(req.body);
  if (error) {
    throw error;
  }
  await mongoose.connect(DATABASEURL, OPTIONS);
  const db = mongoose.connection;
  Content.findByIdAndUpdate(req.body._id, { $set: { time: req.body.time, contentName: req.body.contentName } }).then(
    () => {
      db.close();
      res.redirect("/");
    }
  );
});

router.post("/delete", authorized, async (req, res) => {
  await mongoose.connect(DATABASEURL, OPTIONS);
  const db = mongoose.connection;
  db.on("error", (err) => {
    throw err;
  });
  Content.findOneAndDelete(req.body.deleteBtn)
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      throw err;
    })
    .then(() => db.close());
});
