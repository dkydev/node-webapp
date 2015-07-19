var fs = require("fs");
var ejs = require("ejs");

module.exports.getView = function(template, viewData, callback) {
  fs.readFile(template, "utf-8", function(err, fileData) {
    if (err) {
      console.log(err);
      callback(require('util').inspect(err));
    } else {
      try {
        var renderedHtml = ejs.render(fileData, viewData, null);
      } catch (e) {
        console.log(e);
        callback(require('util').inspect(e));
      }
      callback(renderedHtml);
    }
  });
};
