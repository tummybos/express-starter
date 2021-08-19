const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");

passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
    },
    function (username, password, done) {
      return User.scope("withRole")
        .findOne({ where: { username: username } })
        .then((user) => {
          if (!user) {
            return done(null, false, { message: "Incorrect username." });
          }
          user
            .validPassword(password)
            .then((valid) => {
              if (valid) {
                return done(null, user);
              }
              return done(null, false, { message: "Incorrect password." });
            })
            .catch((err) => {
              done(null, false, { message: err.toString() });
            });
        })
        .catch((err) => {
          return done(err);
        });
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.scope("withRole")
    .findByPk(id)
    .then((user) => done(null, user))
    .catch((err) => done(err, null));
});
module.exports.passport = passport;

module.exports.requireLogin = () => (req, res, next) => {
  if (req.isAuthenticated()) next();
  else return req.resHandler.redirect("/login");
};

module.exports.requirePermission = (permission) => {
  return (req, res, next) => {
    if (req.isAuthenticated()) {
      if (typeof permission == "string" && req.user.can(permission))
        return next();
      else if (Array.isArray(permission)) {
        var allowed = true;
        permission.forEach((p) => {
          if (!req.user.can(p)) allowed = false;
        });
        if (allowed) return next();
      }
    }
    return req.resHandler.redirect("/login");
  };
};
