var moment = require('moment');
var db = require(__base + "lib/db");
var view = require(__base + "lib/view");
var output = require(__base + "lib/output");
var daUser = require(__base + "components/com_user/da");

module.exports.process = function(req, res) {

  var action = req.params.action || "list";

  return actions[action](req, res);

};

var action_list = function(req, res) {

  var data = {};
  data.title = "List Users";
  data.columns = [
    { label : "Username", name : "username" },
    { label : "Email", name : "email" },
    { label : "About", name : "about" },
    { label : "Joined", name : "joined" },
  ];
  data.addURL = "";
  data.editURL = "";
  data.deleteURL = "";
  daUser.getUsers(function(users) {

    data.users = users;
    data.users.map(function(user) {
      user.joined = moment(user.created_ts * 1000).fromNow();
    });

    // Get client message and unset in session.
    if (req.session.message) {
      data.message = req.session.message;
      req.session.message = null;
    }

    output.render("user/list.html", data, function(html) {
        res.send(html);
    });

  });

}

var action_add = function(req, res) {

  var data = {};
  data.title = "Add User";
  data.action = "/user/insert";

  output.render("user/edit.html", data, function(html) {
    res.send(html);
  });

}

var action_edit = function(req, res) {

  var id = req.query.id;

  if (!id) {
    res.redirect("/user/list");
    return;
  }

  var data = {};
  data.title = "Edit User";
  data.action = "/user/update";

  daUser.getUser(id, function(user) {

    data.user = user;

    output.render("user/edit.html", data, function(html) {
        res.send(html);
    });

  });

}

var action_insert = function(req, res) {

  var user = daUser.prepareUser(req.body);

  var result = daUser.validateUser(user);
  if (!result.isValid) {
    req.session.validation = result;
    req.session.message = {type : "success", text : result.message };
  }

  daUser.insertUser(user, function(result) {
    if (result) {
      req.session.message = {type : "success", text : "User added successfully."};
    } else {

    }
  });

  res.redirect("/user/list");
}

var action_update = function(req, res) {
  res.redirect("/user/list");
}

var action_delete = function(req, res) {
  res.redirect("/user/list");
}

var actions = {
  "list" : action_list,
  "add" : action_add,
  "edit" : action_edit,
  "update" : action_update,
  "delete" : action_delete,
  "insert" : action_insert,
};
