var output = require(__base + "lib/output");
var daLogin = require(__base + "components/com_login/da");

module.exports.process = function(req) {

  var action = req.params.action || this.defaultAction;
  return this.actions[action](req);

};

module.exports.defaultAction = "view";
module.exports.actions = {};
var actions = module.exports.actions;

module.exports.actions.view = function(req) {

  if (req.validation) {
    data = req.formData;
    data.validation = req.validation;
  } else {
    var data = {
      validation : false,
    };
  }

  if (!data.username) data.username = "";
  if (!data.password) data.password = "";

  var template;
  var html = "";
  var outputHandler = output.getOutputHandler(req);

  if (req.session.user) {

    data.title = "Logout";
    data.action = "/login/logout";
    data.user = req.session.user;
    template = "login/logout.html";

  } else {

    data.title = "Login";
    data.action = "/login/login";
    template = "login/login.html";

  }

  html = outputHandler.include("master.html", {
    title : data.title,
    message : req.getMessage(req),
    content : outputHandler.include(template, data)
  });

  req.send(html);

};

module.exports.actions.login = function(req) {

  if (req.session.user) {
      req.redirect("/login/view");
  }

  var formData = req.body;
  var result = daLogin.validateLogin(formData);

  if (!result.isValid) {
    req.validation = result;
    req.formData = formData;
    actions.view(req);
    return;
  }

  daLogin.login(formData.username, formData.password, function(error, user) {

    if (error) { req.send(require("util").inspect(error)); return; }

    if (user) {
      req.session.user = user;
      req.session.message = { type : "success", text : "Logged in successfully. Welcome " + user.username + "!" };
    } else {
      req.session.message = { type : "danger", text : "Login failed. Please check your username and password." };

      req.validation = { isValid : false, message : { username : { type : "error" }, password : { type : "error" } } };
      req.formData = formData;

      actions.view(req);

      return;
    }

    req.redirect("/login/view");

  });
};

module.exports.actions.logout = function(req) {

  if (req.session.user) {
    delete req.session.user;
    req.session.message = {type : "success", text : "Logged out successfully."};
  } else {
    req.session.message = {type : "warning", text : "You are not logged in."};
  }

  req.redirect("/login/view");

};
