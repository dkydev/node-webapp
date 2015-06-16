module.exports.process = function(req, res) {

  var mongo = require("mongodb").MongoClient;
  var url = "mongodb://localhost:27017/nwa";

  mongo.connect(url, function(err, db) {

    if (err) res.send(JSON.stringify(err, null, 2));

    var cUsers = db.collection("users");
    cUsers.find().toArray(function(err, docs) {

      if (err) res.send(JSON.stringify(err, null, 2));

      res.send(JSON.stringify(docs, null, 2));
      db.close();
    });

  });

}
