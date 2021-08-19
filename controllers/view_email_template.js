var express = require("express");
var router = express.Router();
const { sendMailTemplate } = require("../lib/mailer");

const { sendMail } = require("../lib/mailer");
const AccountActivationHash = require("../models/account_activation_hash");

router.get("/", (req, res) => {
  const { email } = req.query;
  res.render("email_templates/" + email);
});

module.exports = router;
