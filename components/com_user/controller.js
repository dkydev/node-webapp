var moment = require('moment');
var db = require(__base + "lib/db");
var output = require(__base + "lib/output");
var daUser = require(__base + "components/com_user/da");

module.exports.process = function(req) {

  var action = req.params.action || "list";

  return {
    "list" : action_list,
    "add" : action_add,
    "edit" : action_edit,
    "update" : action_update,
    "delete" : action_delete,
    "insert" : action_insert,
  }[action](req);

};

var action_list = function(req) {

  var data = {};
  data.title = "List Users";
  daUser.getUsers(function(error, users) {

    if (error) {
      req.send(require("util").inspect(error)); return;
    }

    data.users = users;
    data.message = req.getMessage(req);

    req.send(output.render("user/list.html", data));

  });

}

var action_add = function(req) {

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

  data.message = req.getMessage(req);

  req.send(output.render("user/edit.html", data));

}

var action_edit = function(req) {

  var _id = req.query._id;

  if (!_id) {
    req.redirect("/user/list");
    return;
  }

  var data = {};
  data.title = "Edit User";
  data.action = "/user/update";
  data.validation = false;

  data.message = req.getMessage();

  daUser.getUser(_id, function(error, user) {

    if (error) {
      req.send(require("util").inspect(error)); return;
    }

    data.user = user;
    req.send(output.render("user/edit.html", data));

  });
}

var action_insert = function(req) {

  var user = req.body;

  var result = daUser.validateUser(user);

  if (!result.isValid) {
    req.validation = result;
    req.user = user;
    req.session.message = {type : "danger", text : "User not added, please fix the specified errors and try again." };
    action_add(req);
    return;
  }

  daUser.insertUser(user, function(error, result) {

    if (error) {
      req.send(require("util").inspect(error)); return;
    }

    req.session.message = {type : "success", text : "User added successfully."};

    req.redirect("/user/list");

  });
}

var action_update = function(req) {

  var user = req.body;

  var result = daUser.validateUser(user);
  if (!result.isValid) {
    req.validation = result;
    req.user = user;
    req.session.message = {type : "danger", text : "User not added, please fix the specified errors and try again." };
    action_edit(req);
    return;
  }

  user = daUser.prepareUser(user);

  // TODO: Actually update the user.

  req.session.message = {type : "success", text : "User updated successfully."};

  req.redirect("/user/list");

}

var action_delete = function(req) {

  var _id = req.query._id;

  if (!_id) {
    req.redirect("/user/list");
    return;
  }

  daUser.deleteUser(_id, function(error, result) {

    if (error) {
      req.send(require("util").inspect(error)); return;
    }

    if (result.result.ok && result.result.n > 0) {
      req.session.message = {type : "success", text : "User deleted successfully."};
    } else {
      req.session.message = {type : "danger", text : "User NOT deleted."};
    }

    req.redirect("/user/list");

  });
}

var action_validate_user = function(req) {

  var user = req.body;
  return daUser.validateUser(user);

}
