#! /usr/bin/env node
const { sequelize } = require("./lib/db");
const path = require("path");
const glob = require("glob");

const models = {};
glob.sync("./models/*.js").forEach(function (file) {
  var key = path.parse(file)["name"];
  key = key.charAt(0).toUpperCase() + key.slice(1);
  models[key] = require(path.resolve(file));
});

const create = async () => {
  console.log("This script will create the database structure");
  const permissions = ["browse_admin", "manage_roles"];
  sequelize
    .sync({ force: true })
    .then(() =>
      models.Permission.bulkCreate(
        permissions.map((p) => ({ name: p, global: 1 }))
      )
    )
    .then(() =>
      models.Role.bulkCreate([
        { name: "User", permissions: [], global: 1 },
        {
          name: "Super Admin",
          permissions,
          global: 1,
        },
      ])
    )
    .then(async () =>
      models.User.create({
        username: "admin",
        email: "admin@example.com",
        password: await models.User.hashPassword("admin"),
        role_id: 2,
        active: 1,
      })
    )
    .then(() =>
      models.Email_template.bulkCreate([
        {
          title: "activation",
          subject: "Activation your {website} account!",
          message: `Congratulations, your account was created on {website}.
Click on the link below to get your account activated
{activation_link}
If you are unable to click the link, copy it to the address bar of your web browser.
Your registration details are as follows:
Email: {email}
Password: (as specified on the website)

{website}`,
          message_html: "file::activation",
        },
        {
          title: "activated",
          subject: "Welcome to {website} - Your account has been confirmed",
          message: `Congratulations, your {website} account has been successfully activated.
Login to your account to continue.
{website}`,
          message_html: "file::activated",
        },
        {
          title: "password_recovery",
          subject: "{website} Account Password reset request",
          message: `Dear {username},
You have requested to reset your account password
Visit the link below to reset your account password
{recovery_link}
NOTE: If you did not request for this, contact the support immediately.
{website}`,
          message_html: "file::password_recovery",
        },
      ])
    )
    .then(() => console.log("Database Synced Successfully!!!"));
};

const update = async () => {
  console.log("This script will update the database structure");
  sequelize
    .sync({ alter: true })
    .then(() => console.log("Database Synced Successfully!!!"));
};

const argv = process.argv.slice(2);
if (argv.length) {
  const action = argv[0];
  if (action == "create") create();
  else if (action == "update") update();
  else console.log("Action not properly specified!");
}
