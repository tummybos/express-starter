var express = require("express");
var router = express.Router();

router.get("/", (req, res) => {
  const handler = req.resHandler;
  handler.setTitle("Admin CRM");
  handler.send();
});

module.exports = router;
