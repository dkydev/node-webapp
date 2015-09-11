var fs = require("fs");
var ejs = require("ejs");

module.exports.render = function(bodyTemplate, options) {

  var masterTemplate = "master.html";

  options.bodyTemplate = bodyTemplate;

  var html = this.include(masterTemplate, options);

  return html;

};

module.exports.include = function(template, options) {

  var path = __base + "www/themes/default/templates/";

  options = options || {};
  options.include = this.include;

  var html = "";

  try {

    var fileData = fs.readFileSync(path + template, "utf-8");
    html = ejs.render(fileData, options);

  } catch (e) {

    console.log(e);
    html = require('util').inspect(e);

  }

  return html;

}

var tmpl = function(str, data) {

    var fn = new Function("obj",
        "var p=[],print=function(){p.push.apply(p,arguments);};" +
        "with(obj){p.push('" +
        str
          .replace(/[\r\t\n]/g, " ")
          .split("<%").join("\t")
          .replace(/((^|%>)[^\t]*)'/g, "$1\r")
          .replace(/\t=(.*?)%>/g, "',$1,'")
          .split("\t").join("');")
          .split("%>").join("p.push('")
          .split("\r").join("\\'")
      + "');}return p.join('');");
      console.log(fn);
    return fn(data);

};
