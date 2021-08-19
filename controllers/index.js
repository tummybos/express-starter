var express = require("express");
var router = express.Router();
const { sendMailTemplate } = require("../lib/mailer");

const { sendMail } = require("../lib/mailer");

router.get("/", (req, res) => {
  const handler = req.resHandler;
  // sendMailTemplate("activation", "tummybos@gmail.com", {
  //   username: "Tummybos",
  //   email: "tummybos@gmail.com",
  // }).then((info) => info.messageId);
  handler.send();
});

module.exports = router;
