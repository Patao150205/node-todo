const router = require("express").Router();

router.use("/content", require("./content.js"));
router.use("/user", require("./user.js"));

module.exports = router;
