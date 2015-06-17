var fs = require("fs");
var ejs = require("ejs");

module.exports.getView = function(path, data) {


  fs.readFile("./components/test/views/testview.html", "utf-8", function(err, data) {

    if (err) res.send(JSON.stringify(err, null, 2));

    res.send(ejs.render(data, {title : req.params.somevar, users : docs}, null));
    db.close();

  });

};
