var fs = require("fs");
var ejs = require("ejs");

module.exports.getOutputHandler = function(req) {
  return req.outputHandler || (req.outputHandler = new OutputHandler(req));
}

var OutputHandler = function(req) {

  this.req = req;
  this.templateCache = {};
  this.options = {};

}

OutputHandler.prototype.include = function(template, options) {

  var path = __base + "www/themes/default/templates/";

  this.options = options || this.options;
  this.options.output = this;

  var html = "";

//  try {

    path = path + template;
    var fileData = this.templateCache[path] || (this.templateCache[path] = fs.readFileSync(path, "utf-8"));
    html = ejs.render(fileData, this.options);

/*
  } catch (e) {

    console.error(e);
    html = require('util').inspect(e);

  }
*/
  return html;

}
