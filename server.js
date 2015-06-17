global.__base = __dirname + '/';

var express = require("express");
var app = express();

app.use(express.static("www"));

app.get(["/", "/home"], function(req, res) {
  res.send("HOME");
});

app.get(["/:component", "/:component/:action"], function(req, res) {
  try {
    var component = require("./components/" + req.params.component + "/controller.js");
    component.process(req, res);
  } catch (e) {
    res.send(require('util').inspect(e));
    console.log(e);
  }
});

var server = app.listen(8080, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log("Listening at http://%s:%s", host, port);
});
