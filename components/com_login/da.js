var moment = require("moment");
var db = require(__base + "lib/db");

module.exports.login = function(username, password, callback) {

  db.findOne("users", { username : username, password : require("md5")(password) }, function (error, user) {
    if (error) { callback(error); return; }
    callback(null, user);
  });

};

module.exports.validateLogin = function(formData) {

  var result = { isValid : true, message : {} };

  if (!formData.username) {
    result.message.username = { type : "error", text : "Please enter your username." };
    result.isValid = false;
  }

  if (!formData.password) {
    result.message.password = { type : "error", text : "Please enter your password." };
    result.isValid = false;
  }

  return result;

}
