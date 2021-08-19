var express = require("express");
var router = express.Router();

router.get("/", (req, res) => {
  req.resHandler.setTitle("About Us!");
  return req.resHandler.send();
});

module.exports = router;
