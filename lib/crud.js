module.exports.list = function(c) {
  return function(req, res) {
    db.find(class.collection, null, function(items) {
      if (c.each) {
        items = items.map(c.each);
      }
      data = {
        template      : c.pages.list.template || (__base + "components/com_default/views/list.html"),
        title         : c.pages.list.pageTitle || "List",
        columns       : c.columns,
        items         : items,
        addButton     : c.pages.add.action,
        deleteButton  : c.pages.delete.action,
        editButton    : c.pages.edit.action,
      };
      output.render(req, res, data);
    });
  }
}

module.exports.add = function(c) {
  return function(req, res) {
    var data = {
      template      : c.pages.add.template || (__base + "components/com_default/views/form.html"),
      title         : c.pages.add.pageTitle || "Add",
      fields        : c.fields,
      item          : null,
      action        : c.pages.insert.action,
      cancelButton  : c.pages.list.action
    };
    output.render(req, res, data);
  }
}

module.exports.edit = function(c) {
  return function(req, res) {
    if (req.query.id) {
      db.findOne(c.collection, null, function(item) {
        for (var i in c.fields) {
          c.fields[i].value = item[c.fields[i].name];
        }
        var data = {
          template      : c.pages.edit.template || (__base + "components/com_default/views/form.html"),
          title         : c.pages.edit.pageTitle || "Edit",
          fields        : c.fields,
          item          : item,
          action        : c.pages.update.action,
          cancelButton  : c.page.list.action,
        };
        output.render(req, res, data);
      });
    } else {
      res.redirect(c.page.list.action);
    }
  };
}

module.exports.insert = function(c) {
  return function(req, res) {
    // Validate
    var item = {};
    for (var i in c.fields) {
      if (c.fields[i].save) {
        item[c.fields[i].name] = c.fields[i].save(req.body[c.fields[i].name]);
      } else {
        item[c.fields[i].name] = req.body[c.fields[i].name];
      }
      item.created_ts = Math.floor(new Date() / 1000);
    }
    db.insert(collection, item, function(result) {
      req.session.message = {type : "success", text : "User added successfully."};
      res.redirect("/user/list");
    });
  };
}

module.exports.update = function(c) {
  return function(req, res) {
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
  };
}

module.exports.delete = function(c) {
  return function(req, res) {
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
  };
}
