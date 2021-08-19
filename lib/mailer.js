const nodemailer = require("nodemailer");
const fs = require("fs");
const ejs = require("ejs");

const config = require("../config");
const EmailTemplate = require("../models/email_template");

const transporter = nodemailer.createTransport(config.mailConfig);

module.exports.sendMail = (message) => {
  const messageConfig = {
    from: config.mailConfig.auth.user,
    priority: "high",
  };
  messageConfig.to = message.to;
  messageConfig.subject = message.subject;
  messageConfig.text = message.text;
  messageConfig.html = message.html;

  return transporter
    .sendMail(messageConfig)
    .then((info) => {
      console.log("Preview URL: " + nodemailer.getTestMessageUrl(info));
      return info;
    })
    .catch(console.error);
};

module.exports.sendMailTemplate = async (template, to, replacements) => {
  return EmailTemplate.findOne({ where: { title: template } }).then(
    async (template) => {
      if (template == null) return false;
      var message_html;
      if (template.message_html.substring(0, 6) == "file::") {
        const filename = template.message_html.replace("file::", "");
        try {
          message_html = await ejs.renderFile(
            "views/email_templates/" + filename + ".ejs",
            {},
            { delimiter: "?" }
          );
        } catch (err) {
          console.log(err);
          message_html = template.message;
        }
      } else message_html = template.message_html;
      var subject = template.subject;
      var message = template.message;

      subject = subject.replace(new RegExp("{website}", "g"), config.website);
      message = message.replace(new RegExp("{website}", "g"), config.website);
      message_html = message_html.replace(
        new RegExp("{website}", "g"),
        `<a href="${config.websiteUrl}">${config.website}</a>`
      );

      for (prop in replacements) {
        subject = subject.replace(
          new RegExp("{" + prop + "}", "g"),
          replacements[prop]
        );
        message = message.replace(
          new RegExp("{" + prop + "}", "g"),
          replacements[prop]
        );
        message_html = message_html.replace(
          new RegExp("{" + prop + "}", "g"),
          replacements[prop]
        );
      }
      const messageConf = {
        to,
        subject,
        text: message,
        html: message_html,
      };
      return module.exports.sendMail(messageConf);
    }
  );
};
