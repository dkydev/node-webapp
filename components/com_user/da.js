var moment = require('moment');
var db = require(__base + "lib/db");

module.exports.deleteUser = function(user, callback) {

};

module.exports.insertUser = function(user, callback) {

  // Encrypt password.
  user.password = require("md5")(user.password);

  db.insert("users", user, callback);

};

module.exports.updateUser = function(user, callback) {

};

module.exports.getUsers = function(callback) {

  db.find("users", null, callback);

};

module.exports.getUser = function(userId, callback) {

  db.findOne("users", {_id : db.id(userId)}, callback);

};

module.exports.prepareUser = function(obj) {

  for (var i in this.fields) {
    if (this.fields[i].save) {
      if (typeof(this..fields[i].save) === "function") {
        user[this.fields[i].name] = this.fields[i].save(req.body[this..fields[i].name]);
      } else {
        user[this.fields[i].name] = req.body[this.fields[i].name];
      }
    }
    user.created_ts = Math.floor(new Date() / 1000);
  }

}

module.exports.validateUser = function(user) {

}

module.exports.fields = [
  {
    label : "Username",
    name : "username",
    type : "text",
    validation : {
      required : true,
    },
  },
  {
    label : "Email",
    name : "email",
    type : "email",
  },
  {
    label : "Password",
    name : "password",
    type : "password",
    validation : function (value, formData) {
      return value == formData.confirm_password;
    }
  },
  {
    label : "Confirm Password",
    name : "confirm_password",
    type : "password",
    validation : "confirm_password",
  },
  {
    label : "About",
    name : "about",
    type : "textarea",
  }
];
