var mongo = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/nwa";

module.exports.getDB = function(callback) {
  mongo.connect(url, function(err, db) {
    if (err) console.log(err);
    callback(db);
  });
};

module.exports.find = function(collectionName, findParams, callback) {
  module.exports.getDB(function(db) {
      db.collection(collectionName).find(findParams).toArray(function(err, docs) {
        if (err) {
          console.log(err);
          docs = [];
        }
        callback(docs);
      });
  });
};

module.exports.insert = function(collectionName, docs, callback) {
  module.exports.getDB(function(db) {
    if (Array.isArray(docs) && docs.length > 1) {
      db.collection(collectionName).insertMany(docs, function(err, r) {
        if (err) console.log(err);
        callback(r);
      });
    } else {
      db.collection(collectionName).insertOne(docs, function(err, r) {
        if (err) console.log(err);
        callback(r);
      });
    }
  });
};
