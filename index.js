var express = require("express");
var app = express();

app.use(express.static("www"));

app.get("/", function(req, res) {
  res.send("Hello World!");
});

app.get("/test", function(req, res) {
  var test = require("./components/test/test.js");
  test.process(req, res);
});

var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log("Listening at http://%s:%s", host, port);

});
