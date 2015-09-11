var moment = require("moment");
var db = require(__base + "lib/db");

module.exports.deleteUser = function(_id, callback) {

  db.remove("users", { _id : db.id(_id) }, function (error, result) {
    if (error) { callback(error); return; }
    callback(null, result);
  });

};

module.exports.insertUser = function(user, callback) {

  user = this.prepareUser(user);
  user.created_ts = moment().unix();

  // Encrypt password.
  user.password = require("md5")(user.password);

  db.insert("users", user, function (error, result) {
    if (error) { callback(error); return; }
    callback(null, result);
  });

};

module.exports.updateUser = function(user, callback) {

  var id = user._id;
  user = this.prepareUser(user);

  // Update user.

};

module.exports.getUsers = function(callback) {

  db.find("users", null, function(error, users) {
    if (error) { callback(error); return; }
    users.map(function(user) {
      user.joined = moment(user.created_ts * 1000).fromNow();
    });
    callback(null, users);
  });

};

module.exports.getUser = function(_id, callback) {

  db.findOne("users", {_id : db.id(_id)}, function(error, user) {
    if (error) { callback(error); return; }
    user.password = "";
    callback(null, user);
  });

};

module.exports.prepareUser = function(obj) {

  var user = {};

  user.username = obj.username;
  user.email = obj.email;
  user.password = obj.password;
  user.about = obj.about;

  return user;

}

module.exports.getEmptyUser = function() {
  return {
    "_id" : "",
    "username" : "",
    "email" : "",
    "password" : "",
    "confirm_password" : "",
    "about" : "",
  };
}

module.exports.validateUser = function(user) {

  var result = { isValid : true, error : {} };

  if (!user.username || user.username.length < 3) {
    result.error.username = "Username too short. Minimum 3 characters.";
    result.isValid = false;
  }
  if (!user.email || user.email.length < 1) {
    result.error.email = "Please enter a valid email address.";
    result.isValid = false;
  }
  if (!user.password || user.password.length < 6) {
    result.error.password = "Password too short. Minimum 6 characters.";
    result.isValid = false;
  }
  if (user.password != user.confirm_password) {
    result.error.confirm_password = "Password and confirm password do not match.";
    result.isValid = false;
  }

  return result;

}
