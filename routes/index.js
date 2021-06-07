const router = require("express").Router();
const mongoose = require("mongoose");
const { DATABASEURL, OPTIONS } = require("../config/mongo.config.js");
const Content = require("../models/m_content.js");

router.get("/", async (req, res) => {
  await mongoose.connect(DATABASEURL, OPTIONS);
  const db = mongoose.connection;
  db.on("error", (err) => {
    throw err;
  });
  Content.find()
    .sort({ time: 1 })
    .then((data) => {
      res.render("./index.ejs", { data });
    })
    .catch((err) => {
      throw err;
    })
    .then(() => db.close());
});

module.exports = router;
