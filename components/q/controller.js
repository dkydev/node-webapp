module.exports.process = function(req, res) {

  var component = "q";
  var actionMap = {
    "list" : function(req, res) {

        users = require(__base + "lib/db").find("users", null, function(users) {
          res.send(JSON.stringify(users, null, 2));
        });

      },
      "insert" : function(req, res) {

        require(__base + "lib/db").insert("users", {"name" : "banana"}, function(r) {
          res.redirect("/" + component + "/list?r=" + r.insertedCount);
        });

      },
  };

  var action = req.params.action || "list";
  return actionMap[action](req, res);
};
