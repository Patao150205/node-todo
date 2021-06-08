const { DATABASEURL, OPTIONS } = require("../config/mongo.config.js");
const mongoose = require("mongoose");
const router = require("express").Router();
const Content = require("../models/m_content.js");
const { authorized } = require("../config/account.js");
const { CONTENTLENGTH_PER_PAGE } = require("../config/app.config.js").navigation;
const { ObjectId } = require("bson");

router.get("/*", authorized, async (req, res) => {
  const keyword = req.query.keyword || undefined;
  const date = req.query.date || undefined;
  const regexp = new RegExp(`.*${keyword}.*`);
  const page = parseInt(req.query.page) || 1;
  const queryParams = { keyword: keyword || "", date: date || "", page: page || "" };

  await mongoose.connect(DATABASEURL, OPTIONS);
  const db = mongoose.connection;
  let query;
  let target;
  if (keyword) {
    query = { contentName: regexp, _userId: ObjectId(req.user.id) };
    target = keyword;
  } else if (date) {
    query = { time: date, _userId: ObjectId(req.user.id) };
    target = date;
  }
  Promise.all([
    Content.find(query)
      .skip((page - 1) * CONTENTLENGTH_PER_PAGE)
      .limit(CONTENTLENGTH_PER_PAGE),
    Content.find(query).countDocuments(),
  ])
    .then((data) => {
      const [contents, count] = data;
      const pagination = {
        max: Math.ceil(data[1] / CONTENTLENGTH_PER_PAGE),
        current: page,
      };
      res.render("./search.ejs", { contents, count, target, pagination, queryParams, username: req.user.username });
    })
    .catch((err) => {
      throw err;
    })
    .then(() => {
      db.close();
    });
});

module.exports = router;
