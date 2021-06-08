const router = require("express").Router();

router.use("/content", require("./content.js"));

module.exports = router;
