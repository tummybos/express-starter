const path = require("path");
const fs = require("fs");
const ejs = require("ejs");

const config = require("../config");
const AppSettings = require("../models/app_settings");

const base = process.cwd();
const templatePath = path.join(base, "views", "templates");

class ResponseHandler {
  status = { msg: "", type: "", code: 0 };
  data = {};
  page = "";
  title = "";
  template = "";
  mode = "html";
  settings = {};
  settings_loaded = false;

  constructor(req, res) {
    this.req = req;
    this.res = res;
    this.title = config.defaultTitle;
    this.template = config.defaultTemplate;
  }
  send() {
    if (this.mode == "json") {
      this.res.json(this.data);
    } else {
      var title = this.getFullTitle();
      var template = getTemplateFile(this.template);
      var page = fs.existsSync(path.join(base, "views", "pages", this.page + ".ejs")) ? this.page : "404";
      if (this.mode == "ajax" || !template) {
        this.res.render("pages/" + page, {
          title: this.getTitle(),
          fullTitle: this.getFullTitle(),
          website: { name: config.website, url: config.websiteUrl },
          ...this.data,
          status: this.status,
          printMsg: this.printMsg,
        });
      } else {
        this.res.render("templates/" + template, {
          title: this.getTitle(),
          fullTitle: this.getFullTitle(),
          website: { name: config.website, url: config.websiteUrl },
          page: page,
          ...this.data,
          status: this.status,
          printMsg: this.printMsg,
        });
      }
    }
  }
  error(err) {
    // set locals, only providing error in development
    this.res.locals.message = err.message;
    this.res.locals.error = this.req.app.get("env") === "development" ? err : {};

    // render the error page
    this.res.status(err.status || 500);
    if (this.mode == "json")
      this.res.json({
        status: { msg: err.message, type: "error", code: -1, err: err },
      });
    else this.res.render("templates/error");
  }
  redirect(url) {
    this.res.redirect(url);
  }

  getMsg() {
    return this.status;
  }
  setMsg(msg, type = null, code = null) {
    this.status.msg = msg;
    this.status.type = type ? type : "info";
    this.status.code = code ? code : 0;
  }
  setSessionMsg(msg, type = null, code = null) {
    const status = {};
    status.msg = msg;
    status.type = type ? type : "info";
    status.code = code ? code : 0;
    this.req.session.status = status;
  }
  printMsg() {
    if (this.status.msg) {
      const contextual = {
        success: "success",
        info: "info",
        warning: "warning",
        error: "danger",
      };
      return `<div class="alert alert-${contextual[this.status.type]} alert-dismissible fade show" role="alert">
      ${this.status.msg}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`;
    } else return "";
  }

  getTitle() {
    return this.title;
  }
  getFullTitle() {
    return this.title + config.titleSuffix;
  }
  setTitle(title) {
    this.title = title;
  }

  get(key) {
    if (this.data[key]) return key;
    return "";
  }
  assign(key, val) {
    this.data[key] = val;
  }

  getTemplate() {
    return this.template;
  }
  setTemplate(template) {
    this.template = template;
  }

  getPage() {
    return this.page;
  }
  setPage(page) {
    this.page = page;
  }

  getMode() {
    return this.mode;
  }
  setMode(mode) {
    const allowed_modes = ["html", "json", "ajax"];
    if (allowed_modes.includes(mode)) this.mode = mode;
  }
  async getSettings(key) {
    if (this.settings_loaded) {
      if (this.settings[key]) return this.settings[key];
      return "";
    } else {
      const settings = await AppSettings.findAll();
      settings.forEach(s => {
        this.settings[s.setting_key] = s.setting_value;
      });
      this.settings_loaded = true;
      if (this.settings[key]) return this.settings[key];
      return "";
    }
  }
  async saveSettings(key, value) {
    return await AppSettings.findOrCreate({
      where: { setting_key: key },
      defaults: { setting_value: value },
    });
  }
}

function getTemplateFile(template) {
  var templateFile = path.join(templatePath, template + ".ejs");
  if (fs.existsSync(templateFile)) {
    return template;
  } else if (fs.existsSync(path.join(templatePath, template, "index.ejs"))) {
    return template + "/index";
  } else return null;
}

module.exports = ResponseHandler;
