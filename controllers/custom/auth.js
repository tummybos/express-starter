const { body, validationResult } = require("express-validator");
const User = require("../../models/user");

module.exports.register = {
  get: (req, res, next) => {
    req.resHandler.setTemplate("signin/register");
    req.resHandler.setTitle("Create Account");
    return req.resHandler.send();
  },
  post: [
    // Validate and sanitize fields.
    body("username", "Please supply a valid username")
      .trim()
      .isLength({ min: 3 })
      .escape(),
    body("email", "Please supply a valid email")
      .trim()
      .isLength({ min: 3 })
      .escape(),
    body("password", "Enter valid password")
      .trim()
      .isLength({ min: 6 })
      .escape(),

    // Process request after validation and sanitization.
    async (req, res, next) => {
      const handler = req.resHandler;
      handler.setTitle("Create Account");
      // Extract the validation errors from a request.
      const errors = validationResult(req);

      // Create a Book object with escaped and trimmed data.
      var user = User.build({
        username: req.body.username,
        email: req.body.email,
        role_id: 1,
      });
      if (!errors.isEmpty()) {
        // There are errors. Render form again with sanitized values/error messages.
        next(errors);
        return;
      } else {
        // Data from form is valid. Save book.
        const bypassActivation = await handler.getSettings(
          "bypass_user_activation"
        );
        if (bypassActivation) user.active = 1;
        User.hashPassword(req.body.password).then((pass) => {
          user.password = pass;
          user
            .save()
            .then((user) => {
              if (bypassActivation) {
                passport.authenticate("local")(req, res);
                handler.redirect("/login");
              } else {
                handler.setSessionMsg(
                  "You are required to activate your account"
                );
                handler.redirect(
                  "/register/account-activate?user=" + user.username
                );
              }
            })
            .catch((err) => {
              return next(err);
            });
        });
      }
    },
  ],
};

module.exports.login = {
  get: (req, res, next) => {
    req.resHandler.setTemplate("signin/index");
    req.resHandler.setTitle("Login");
    if (req.isAuthenticated()) req.resHandler.redirect("/");
    else return req.resHandler.send();
  },
  post: (req, res, next) => {
    req.resHandler.setTemplate("signin/index");
    req.resHandler.setTitle("Login");
    if (req.isAuthenticated() && req.user) req.resHandler.redirect("/");
    else return req.resHandler.send();
  },
};
