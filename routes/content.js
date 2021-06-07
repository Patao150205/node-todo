const router = require("express").Router();
const mongoose = require("mongoose");
const { DATABASEURL, OPTIONS } = require("../config/mongo.config.js");
const Content = require("../models/m_content.js");
const { validateContent } = require("./utils/validate");

const initialData = {
  time: undefined,
  contentName: undefined,
};

function createSendData(body) {
  return {
    time: new Date(body.time),
    contentName: body.contentName,
  };
}

router.post("/edit", async (req, res) => {
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

router.post("/edit/excute", async (req, res) => {
  const error = validateContent(req.body);
  if (error) {
    throw error;
  }
  await mongoose.connect(DATABASEURL, OPTIONS);
  const db = mongoose.connection;
  db.on("error", (err) => {
    throw err;
  });
  Content.findByIdAndUpdate(req.body._id, { $set: { time: req.body.time, contentName: req.body.contentName } }).then(
    () => {
      db.close();
      res.end();
    }
  );
});

router.post("/delete", async (req, res) => {
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

router
  .get("/regist", (req, res) => {
    res.render("content/regist-form.ejs", { data: initialData });
  })
  .post("/regist", (req, res) => {
    res.render("content/regist-form.ejs", { data: req.body });
  });

router.post("/regist/excute", async (req, res) => {
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
  const data = createSendData(req.body);
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

router.get("/regist/complete", (req, res) => {
  res.render("content/complete.ejs");
});

router.route("/regist/confirm").post((req, res) => {
  const error = validateContent(req.body);
  if (error) {
    res.render("content/regist-form.ejs", { error, data: req.body });
    return;
  }
  res.render("content/confirm.ejs", { data: req.body });
});

module.exports = router;
