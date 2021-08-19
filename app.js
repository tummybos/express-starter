const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const compression = require("compression");
const helmet = require("helmet");
const glob = require("glob");
const session = require("express-session");
const app = express();
const { readdirSync } = require("fs");

const authRouter = require("./routes/auth");
const { passport } = require("./lib/auth");
const configure = require("./lib/configure");

app.use(helmet({ contentSecurityPolicy: false }));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.set("view options", { delimiter: "?" });

// app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
  })
);
// app.use(session({ secret: "secret" }));

app.use(passport.initialize());
app.use(passport.session());

if (app.get("env") === "production") {
  app.set("trust proxy", 1); // trust first proxy
  sess.cookie.secure = true; // serve secure cookies
}
app.use(compression()); //Compress all routes

app.use(express.static(path.join(__dirname, "public")));

// load templates static public directories
readdirSync("./views/templates", { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => {
    app.use(`/templates/${dirent.name}`, express.static(path.join(__dirname, `views/templates/${dirent.name}/public`)));
  });

app.use(configure);

app.use("/", authRouter);

// load controllers
glob.sync("./controllers/*.js").forEach(function (file) {
  app.use(`/${path.parse(file)["name"]}`, require(path.resolve(file)));
});
app.use("/", require("./controllers/index"));

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("templates/error");
});

module.exports = app;
