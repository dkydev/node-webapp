var mongodb = require("mongodb");
var url = "mongodb://localhost:27017/nwa";

module.exports.getDB = function(callback) {
  mongodb.MongoClient.connect(url, function(error, db) {
    if (error) console.log(error);
    callback(db);
  });
};

module.exports.find = function(collectionName, find, callback) {
  module.exports.getDB(function(db) {
    db.collection(collectionName).find(find).toArray(function(error, docs) {
      if (error) {
        console.log(error);
        docs = [];
      }
      callback(docs);
    });
  });
};

module.exports.findOne = function(collectionName, find, callback) {
  module.exports.getDB(function(db) {
      db.collection(collectionName).findOne(find, function(error, doc) {
        if (error) {
          console.log(error);
          docs = null;
        }
        callback(doc);
      });
  });
};

module.exports.insert = function(collectionName, docs, callback) {
  module.exports.getDB(function(db) {
    if (Array.isArray(docs) && docs.length > 1) {
      db.collection(collectionName).insertMany(docs, function(error, result) {
        if (error) console.log(error);
        callback(result);
      });
    } else {
      db.collection(collectionName).insertOne(docs, function(error, result) {
        if (error) console.log(error);
        callback(result);
      });
    }
  });
};

module.exports.update = function(collectionName, find, update, callback) {
  module.exports.getDB(function(db) {
      db.collection(collectionName).update(find, update, function(error, result) {
        if (error) console.log(error);
        callback(result);
      });
  });
};

module.exports.remove = function(collectionName, find, callback) {
  module.exports.getDB(function(db) {
      db.collection(collectionName).remove(find, function(error, result) {
        if (error) console.log(error);
        callback(result);
      });
  });
};

module.exports.id = function(objectId) {
  return mongodb.ObjectID(objectId);
}
