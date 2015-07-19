var viewHandler = require(__base + "lib/view");

module.exports.render = function(req, res, options) {

  if (!options.template) {
    res.send("template not specified");
  }
  options.masterTemplate = options.masterTemplate || __base + "components/com_default/views/master.html";

  viewHandler.getView(options.template, options, function(html) {
    if (req.session.message) {
      options.message = req.session.message;
      req.session.message = null;
    }
    options.content = html;

    viewHandler.getView(options.masterTemplate, options, function(html) {
      res.send(html);
    });

  });

};
