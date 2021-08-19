var express = require("express");
var router = express.Router();
const auth = require("../controllers/custom/auth");
const { passport } = require("../lib/auth");

/* Login. */
router.get("/login", auth.login.get);
router.post("/login", passport.authenticate("local"), auth.login.post);
router.get("/logout", function (req, res) {
  req.logout();
  req.resHandler.redirect("/login");
});

/* Register. */
router.get("/register", auth.register.get);
router.post("/register", auth.register.post);

module.exports = router;
