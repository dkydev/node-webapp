
module.exports.getRequestHandler = function(req, res) {
  var requestHandler = new RequestHandler(req, res);
  requestHandler.processRequest();
}

var RequestHandler = function(req, res) {
  this.req = req;
  this.res = res;

  this.body = req.body;
  this.query = req.query;
  this.params = req.params;
  this.session = req.session;
}

RequestHandler.prototype.processRequest = function() {

  if (!this.req.params.component || this.req.params.component == "" || this.req.params.component == "home") {
    this.res.send("We're home!");
    return;
  }

  try {
    var component = require(__base + "components/com_" + this.req.params.component + "/controller.js");
  } catch (e) {
    this.res.send("404");
    console.error(e)
  }

  if (component) {
    // Set action parameter to null if it does not exist for the requested component.
    // This will cause the default action to be processed instead.
    if (!component.actions[this.req.params.action]) {
      this.req.params.action = null
    }
    component.process(this);
  }

};

RequestHandler.prototype.getMessage = function() {

  var message = false;

  if (this.req.session.message) {
    message = this.req.session.message;
    delete this.req.session.message;
  }

  return message;

}

RequestHandler.prototype.send = function(data) {

  this.res.send(data);

}

RequestHandler.prototype.redirect = function(path) {

  this.res.redirect(path);

}
