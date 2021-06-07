const router = require("express").Router();
const mongoose = require("mongoose");
const { DATABASEURL, OPTIONS } = require("../../config/mongo.config.js");
const Content = require("../../models/m_content.js");

router.get("/content", async (req, res) => {
  await mongoose.connect(DATABASEURL, OPTIONS);
  const db = mongoose.connection;
  db.on("error", (err) => {
    throw err;
  });
  Content.find({})
    .then((doc) => {
      res.json(doc);
    })
    .catch((err) => {
      throw err;
    })
    .then(() => {
      db.close();
    });
});

module.exports = router;
