var db = require(__base + "lib/db");
var view = require(__base + "lib/view");
var output = require(__base + "lib/output");

module.exports.process = function(req, res) {

  var collection = "users";

  var columns = [
    { label : "Username", name : "username" },
    { label : "Email", name : "email" },
    { label : "About", name : "about" },
    { label : "Date Joined", name : "created_ts" },
  ];

  var fields = [
    {
      label : "Username",
      name : "username",
      type : "text",
      required : true
    },
    {
      label : "Email",
      name : "email",
      type : "email",
      required : true
    },
    {
      label : "Password",
      name : "password",
      type : "password",
      required : true,
      save : function(value) { return require("md5")(value); }
    },
    {
      label : "About",
      name : "about",
      type : "textarea"
    }
  ];

  var actionMap = {
    "list" : function(req, res) {
      db.find(collection, null, function(items) {
        data = {
          template :  __base + "components/com_default/views/list.html",
          title : "List Users",
          columns : columns,
          items : items,
          addButton : "/user/add",
          deleteButton : "/user/delete",
          editButton : "/user/edit"
        };
        output.render(req, res, data);
      });
    },
    "add" : function(req, res) {
      var data = {
        template :  __base + "components/com_default/views/form.html",
        title : "Add User",
        action : "/user/insert",
        fields : fields,
        item : null,
        cancelButton : "/user/list"
      };
      output.render(req, res, data);
    },
    "edit" : function(req, res) {
      if (req.query.id) {
        db.findOne(collection, null, function(item) {
          for (var i in fields) {
            fields[i].value = item[fields[i].name];
          }
          var data = {
            template :  __base + "components/com_default/views/form.html",
            title : "Edit User",
            action : "/user/update",
            fields : fields,
            item : item,
            cancelButton : "/user/list"
          };
          output.render(req, res, data);
        });
      } else {
        res.redirect("/user/list");
      }
    },
    "insert" : function(req, res) {
        // Validate
        var item = {};
        for (var i in fields) {
          if (fields[i].save) {
            item[fields[i].name] = fields[i].save(req.body[fields[i].name]);
          } else {
            item[fields[i].name] = req.body[fields[i].name];
          }
          item.created_ts = Math.floor(new Date() / 1000);
        }
        db.insert(collection, item, function(result) {
          req.session.message = {type : "success", text : "User added successfully."};
          res.redirect("/user/list");
        });
    },
    "update" : function(req, res) {
      // Validate
      if (req.body.id) {
        var set = {};
        for (var i in fields) {
          if (fields[i].save) {
            set[fields[i].name] = fields[i].save(req.body[fields[i].name]);
          } else {
            set[fields[i].name] = req.body[fields[i].name];
          }
        }
        db.update(collection, {_id : require("mongodb").ObjectID(req.body.id)}, {$set : set}, function(result) {
          req.session.message = {type : "success", text : "User updated successfully."};
          res.redirect("/user/list");
        });
      } else {
        res.redirect("/user/list");
      }
    },
    "delete" : function(req, res) {
      if (req.body.delete) { // Delete many.
        var idList = req.body.delete.map(function(id) { return require("mongodb").ObjectID(id); });
        db.remove(collection, {_id : { $in : idList }}, function(response) {
          if (response.result.n > 0) {
            req.session.message = {type : "success", text : response.result.n + " user" + (response.result.n > 1 ? "s" : "") + " deleted successfully."};
          } else {
            req.session.message = {type : "info", text : "Nothing selected."};
          }
          res.redirect("/user/list");
        });
      } else if (req.query.id) { // Delete one.
        var id = require("mongodb").ObjectID(req.query.id);
        db.remove(collection, {_id : id}, function(response) {
          req.session.message = {type : "success", text : "User deleted successfully."};
          res.redirect("/user/list");
        });
      } else {
        req.session.message = {type : "info", text : "Nothing selected."};
        res.redirect("/user/list");
      }
    },
  };
  var action = req.params.action || "list";
  return actionMap[action](req, res);
};
