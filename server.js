global.__base = __dirname + '/';

var express = require("express");
var bodyParser = require("body-parser");
var session = require("express-session")
var app = express();

app.use(express.static("www"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: "banana",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

var handleHomeRequest = function(req, res) {
  try {
    var component = require("./components/com_default/controller.js");
    component.process(req, res);
  } catch (e) {
    res.send(require('util').inspect(e));
    console.log(e);
  }
};

var handleComponentRequest = function(req, res) {
  try {
    var component = require("./components/com_" + req.params.component + "/controller.js");
    component.process(req, res);
  } catch (e) {
    res.send(require('util').inspect(e));
    console.log(e);
  }
};

app.get(["/:component", "/:component/:action"], handleComponentRequest);
app.post(["/:component", "/:component/:action"], handleComponentRequest);

app.get(["/", "/home"], handleHomeRequest);
app.post(["/", "/home"], handleHomeRequest);

var server = app.listen(8080, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log("Listening at http://%s:%s", host, port);
});
