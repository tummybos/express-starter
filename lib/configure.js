const config = require("../config");
const ResponseHandler = require("./responseHandler");

module.exports = (req, res, next) => {
  var path = req.originalUrl;
  var paths = path.substring(1).split("/");
  req.paths = paths;
  var route;
  if (paths[0]) route = paths[0];
  else route = "index";
  req.resHandler = new ResponseHandler(req, res);
  req.resHandler.setTemplate(config.defaultTemplate);
  if (req.session.status) {
    req.resHandler.setMsg(req.session.status.msg, req.session.status.type, req.session.status.code);
    delete req.session.status;
  }
  if (!req.resHandler.getPage()) req.resHandler.setPage(route);
  if (req.user) req.resHandler.assign("user", req.user.profile());
  next();
};
