const config = {
  port: "3000",
  dbHost: "localhost",
  dbUser: "root",
  dbPassword: "monerod",
  dbName: "express_app",
  dbPrefix: "lb_",
  isDev: true,

  titleSuffix: " | Express App",
  defaultTitle: "Welcome",
  defaultTemplate: "index/index",

  website: "Express App",
  websiteUrl: "http://localhost:3000/",
};

var mailConfig;
if (process.env.NODE_ENV === "production") {
  // all emails are delivered to destination
  mailConfig = {
    host: "smtp.sendgrid.net",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "real.user",
      pass: "verysecret",
    },
  };
} else {
  // all emails are caught by ethereal.email
  mailConfig = {
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "aagsa2ac7mv6cnku@ethereal.email",
      pass: "MeAh6PAYjfhbsEcPPA",
    },
    tls: {
      rejectUnauthorized: false,
    },
  };
}
config.mailConfig = mailConfig;
module.exports = config;
