var express = require("express");
var router = express.Router();
const { requireLogin } = require("../lib/auth");

router.get("/", requireLogin(), (req, res) => {
  res.send("Profile");
});

module.exports = router;
