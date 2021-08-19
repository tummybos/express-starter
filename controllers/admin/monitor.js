var express = require("express");
var router = express.Router();

router.get((req, res) => {
  res.send("Monitor Admin");
});

module.exports = router;
