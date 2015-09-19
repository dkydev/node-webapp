var moment = require('moment');
var db = require(__base + "lib/db");
var output = require(__base + "lib/output");
var daUser = require(__base + "components/com_user/da");

module.exports.process = function(req) {

  var action = req.params.action || this.defaultAction;
  return this.actions[action](req);

};

module.exports.defaultAction = "list";
module.exports.actions = {};
var actions = module.exports.actions;

module.exports.actions.list = function(req) {

  var data = {};
  data.title = "List Users";
  daUser.getUsers(function(error, users) {

    if (error) { req.send(require("util").inspect(error)); return; }

    data.users = users;

    var outputHandler = output.getOutputHandler(req);
    var html = outputHandler.include("master.html", {
      title : data.title,
      message : req.getMessage(req),
      content : outputHandler.include("user/list.html", data)
    });

    req.send(html);

  });
};

module.exports.actions.add = function(req) {

  var data = {};
  data.title = "Add User";
  data.action = "/user/insert";

  if (req.validation) {
    data.validation = req.validation;
    data.user = req.user;
  } else {
    data.validation = false;
    data.user = daUser.getEmptyUser();
  }

  var outputHandler = output.getOutputHandler(req);
  var html = outputHandler.include("master.html", {
    title : data.title,
    message : req.getMessage(req),
    content : outputHandler.include("user/edit.html", data)
  });

  req.send(html);

};

module.exports.actions.edit = function(req) {

  var _id = req.query._id;

  if (!_id) {
    req.redirect("/user/list");
    return;
  }

  var data = {};
  data.title = "Edit User";
  data.action = "/user/update";

  var outputHandler = output.getOutputHandler(req);

  if (req.validation) {

    data.validation = req.validation;
    data.user = req.user;

    var html = outputHandler.include("master.html", {
      title : data.title,
      message : req.getMessage(req),
      content : outputHandler.include("user/edit.html", data)
    });

    req.send(html);

  } else {

    data.validation = false;
    data.user = daUser.getEmptyUser();
    daUser.getUser(_id, function(error, user) {

      if (error) { req.send(require("util").inspect(error)); return; }

      data.user = user;

      var html = outputHandler.include("master.html", {
        title : data.title,
        message : req.getMessage(req),
        content : outputHandler.include("user/edit.html", data)
      });

      req.send(html);

    });

  }
};

module.exports.actions.insert = function(req) {

  var user = req.body;

  daUser.validateUser(user, function (error, result) {

    if (error) { req.send(require("util").inspect(error)); return; }

    if (!result.isValid) {
      req.validation = result;
      req.user = user;
      req.session.message = { type : "danger", text : "User NOT added, please fix the specified errors and try again." };
      actions.add(req);
      return;
    }

    daUser.insertUser(user, function(error, result) {

      if (error) { req.send(require("util").inspect(error)); return; }

      if (result.result.ok && result.result.n > 0) {
        req.session.message = { type : "success", text : "User added successfully." };
      } else {
        req.session.message = { type : "danger", text : "User NOT added." };
      }

      req.redirect("/user/list");

    });
  });
};

module.exports.actions.update = function(req) {

  var user = req.body;

  if (!user._id) {
    req.redirect("/user/list");
    return;
  }

  daUser.validateUser(user, function(error, result) {

    if (error) { req.send(require("util").inspect(error)); return; }

    if (!result.isValid) {
      req.validation = result;
      req.user = user;
      req.query._id = user._id;
      req.session.message = { type : "danger", text : "User NOT updated, please fix the specified errors and try again." };
      actions.edit(req);
      return;
    }

    daUser.updateUser(user, function(error, result) {

        if (error) { req.send(require("util").inspect(error)); return; }

        if (result.result.ok && result.result.n > 0) {
          req.session.message = { type : "success", text : "User updated successfully." };
        } else {
          req.session.message = { type : "danger", text : "User NOT updated." };
        }

        req.redirect("/user/list");

    });
  });
};

module.exports.actions.delete = function(req) {

  var _id = req.query._id;

  if (!_id) {
    req.redirect("/user/list");
    return;
  }

  daUser.deleteUser(_id, function(error, result) {

    if (error) { req.send(require("util").inspect(error)); return; }

    if (result.result.ok && result.result.n > 0) {
      req.session.message = { type : "success", text : "User deleted successfully." };
    } else {
      req.session.message = { type : "danger", text : "User NOT deleted." };
    }

    req.redirect("/user/list");

  });

};

module.exports.actions.validate_user = function(req) {

  var user = req.body;
  return daUser.validateUser(user);

};
