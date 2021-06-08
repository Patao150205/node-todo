const router = require("express").Router();
const mongoose = require("mongoose");
const { DATABASEURL, OPTIONS } = require("../config/mongo.config.js");
const { CONTENTLENGTH_PER_PAGE } = require("../config/app.config.js").navigation;
const Content = require("../models/m_content.js");
const { authorized } = require("../config/account.js");
const { ObjectId } = require("bson");

router.get("/", authorized, async (req, res) => {
  await mongoose.connect(DATABASEURL, OPTIONS);
  const db = mongoose.connection;
  const page = parseInt(req.query.page) || 1;
  Promise.all([
    Content.find({ _userId: ObjectId(req.user.id) })
      .skip((page - 1) * CONTENTLENGTH_PER_PAGE)
      .limit(CONTENTLENGTH_PER_PAGE),
    Content.find({ _userId: ObjectId(req.user.id) }).countDocuments(),
  ])
    .then((data) => {
      const [contents, count] = data;
      const pagination = {
        max: Math.ceil(data[1] / CONTENTLENGTH_PER_PAGE),
        current: page,
      };
      res.render("./index.ejs", { contents, count: count, pagination, username: req.user.username });
    })
    .catch((err) => {
      throw err;
    })
    .then(() => db.close());
});

module.exports = router;
