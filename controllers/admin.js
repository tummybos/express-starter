var express = require("express");
var router = express.Router();
const glob = require("glob");
const path = require("path");
const { requirePermission } = require("../lib/auth");

// load controllers
router.use("/", requirePermission("browse_admin"), (req, res, next) => {
  req.resHandler.setTemplate("dashboard/index");
  req.resHandler.setPage(`admin/index`);
  next();
});
glob.sync("./controllers/admin/*.js").forEach(function (file) {
  router.use(
    `/${path.parse(file)["name"]}`,
    (req, res, next) => {
      req.resHandler.setPage(`admin/${path.parse(file)["name"]}`);
      next();
    },
    require(path.resolve(file))
  );
});
router.use("/", require("./admin/index"));

module.exports = router;
