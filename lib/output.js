var viewHandler = require(__base + "lib/view");

module.exports.masterTemplate = "master.html";

module.exports.render = function(template, options, callback) {

  options.template = template;
  options.masterTemplate = this.masterTemplate;

  // Render inner template.
  viewHandler.getView(options.template, options, function(html) {

    // Attach rendered inner template to options.
    options.content = html;

    // Render outer template.
    viewHandler.getView(options.masterTemplate, options, function(html) {

      callback(html);

    });

  });

};
