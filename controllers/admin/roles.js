const Role = require("../../models/role");
const Permission = require("../../models/permission");
const async = require("async");
const createError = require("http-errors");
const { body, param, validationResult } = require("express-validator");
var express = require("express");
var router = express.Router();

router.get("/:id/edit", (req, res) => {
  const handler = req.resHandler;
  if (req.params.id) {
    async.parallel(
      {
        role: (callback) => {
          Role.findByPk(req.params.id).then((role) => callback(null, role));
          // .then((err) => callback(err, null));
        },
        permissions: (callback) => {
          Permission.findAll().then((permissions) =>
            callback(null, permissions)
          );
          // .then((err) => callback(err, null));
        },
      },
      (err, results) => {
        if (err) return errResponse(createError(400), req, res);
        handler.assign("role", results.role);
        handler.assign(
          "global_permissions",
          results.permissions.filter((p) => p.global)
        );
        handler.assign(
          "entity_permissions",
          results.permissions.filter((p) => !p.global)
        );
        handler.setPage("admin/edit_role");
        return req.resHandler.send();
      }
    );
  } else return errResponse(createError(400), req, res);
});
router.post(
  "/:id/edit",
  body("name", "Name must not be empty.").trim().isLength({ min: 3 }).escape(),
  body("global", "Specify if its global or not")
    .trim()
    .isNumeric({ min: 0, max: 1 })
    .escape(),
  param("id", "Role not specified!").isNumeric(),
  async (req, res) => {
    const handler = req.resHandler;
    const errors = validationResult(req);
    if (req.params.id) {
      handler.setPage("admin/edit_role");
      async.parallel(
        {
          role: (callback) => {
            Role.findByPk(req.params.id).then((role) => callback(null, role));
            // .then((err) => callback(err, null));
          },
          permissions: (callback) => {
            Permission.findAll().then((permissions) =>
              callback(null, permissions)
            );
            // .then((err) => callback(err, null));
          },
        },
        (err, results) => {
          var role = results.role;
          if (err || !role) return handler.error(createError(400));

          role.name = req.body.name;
          role.global = req.body.global;
          role.permissions =
            role.global == 1
              ? req.body.global_permissions
              : req.body.entity_permissions;

          handler.assign("role", role);
          handler.assign(
            "global_permissions",
            results.permissions.filter((p) => p.global)
          );
          handler.assign(
            "entity_permissions",
            results.permissions.filter((p) => !p.global)
          );
          if (errors.isEmpty()) {
            role.save().then((role) => {
              handler.assign("role", role);
              req.resHandler.send();
            });
          } else {
            handler.assign("errors", errors.array());
            req.resHandler.send();
          }
        }
      );
    } else return errResponse(createError(400), req, res);
  }
);

router.get("/new", (req, res) => {
  const handler = req.resHandler;
  async.parallel(
    {
      permissions: (callback) => {
        Permission.findAll().then((permissions) => callback(null, permissions));
        // .then((err) => callback(err, null));
      },
    },
    (err, results) => {
      if (err) return errResponse(createError(400), req, res);
      handler.assign(
        "global_permissions",
        results.permissions.filter((p) => p.global)
      );
      handler.assign(
        "entity_permissions",
        results.permissions.filter((p) => !p.global)
      );
      handler.setPage("admin/edit_role");
      return req.resHandler.send();
    }
  );
});
router.post(
  "/new",
  body("name", "Name must not be empty.").trim().isLength({ min: 3 }).escape(),
  body("global", "Specify if its global or not")
    .trim()
    .isNumeric({ min: 0, max: 1 })
    .escape(),
  async (req, res) => {
    const handler = req.resHandler;
    const errors = validationResult(req);
    handler.setPage("admin/edit_role");
    async.parallel(
      {
        permissions: (callback) => {
          Permission.findAll().then((permissions) =>
            callback(null, permissions)
          );
          // .then((err) => callback(err, null));
        },
      },
      (err, results) => {
        var role = Role.build({
          name: req.body.name,
          global: req.body.global,
          permissions: [],
        });
        if (err || !role) return errResponse(createError(400), req, res);

        role.name = req.body.name;
        role.global = req.body.global;
        role.permissions =
          role.global == 1
            ? req.body.global_permissions
            : req.body.entity_permissions;
        handler.assign(`role`, role);
        handler.assign(
          "global_permissions",
          results.permissions.filter((p) => p.global)
        );
        handler.assign(
          "entity_permissions",
          results.permissions.filter((p) => !p.global)
        );
        handler.setPage("admin/edit_role");
        if (errors.isEmpty()) {
          role.save().then((role) => {
            handler.assign(`role`, role);
            return handler.redirect("/admin/roles");
          });
        } else {
          handler.assign("errors", errors.array());
          return req.resHandler.send();
        }
      }
    );
  }
);

//routes
router.get(["/", "/:id"], (req, res) => {
  const handler = req.resHandler;
  if (req.params.id)
    return Role.findByPk(req.params.id)
      .then((role) => {
        handler.assign(`role`, role);
        // req.resHandler.send();
        res.send(role);
      })
      .catch((err) => res.send(err));
  else
    Role.findAll()
      .then((roles) => {
        handler.assign(`roles`, roles);
        // handler.setPage("admin/edit_role");
        handler.send();
      })
      .catch((err) => req.resHandler.error(err));
});

router.get("/:id/delete", (req, res, next) => {
  if (req.params.id) {
    return Role.findByPk(req.params.id)
      .then((role) => {
        role.destroy().then(() => {
          req.resHandler.redirect("/admin/roles");
        });
      })
      .catch((err) => req.resHandler.error(err));
  } else return req.resHandler.error(createError(400));
});

module.exports = router;
