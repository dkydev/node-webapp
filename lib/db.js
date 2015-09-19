var mongodb = require("mongodb");
var url = "mongodb://localhost:27017/nwa";

module.exports.getDB = function(callback) {
  mongodb.MongoClient.connect(url, function(error, db) {
    callback(error, db);
  });
};

module.exports.find = function(collectionName, find, callback) {
  this.getDB(function(error, db) {
    if (error) { callback(error); return };
    db.collection(collectionName).find(find).toArray(function(error, docs) {
      callback(error, docs);
      db.close();
    });
  });
};

module.exports.findOne = function(collectionName, find, callback) {
  this.getDB(function(error, db) {
    if (error) { callback(error); return };
    db.collection(collectionName).findOne(find, function(error, doc) {
      callback(error, doc);
      db.close();
    });
  });
};

module.exports.insert = function(collectionName, docs, callback) {
  this.getDB(function(error, db) {
    if (error) { callback(error); return };
    if (Array.isArray(docs) && docs.length > 1) {
      db.collection(collectionName).insertMany(docs, function(error, result) {
        callback(error, result);
        db.close();
      });
    } else {
      db.collection(collectionName).insertOne(docs, function(error, result) {
        callback(error, result);
        db.close();
      });
    }
  });
};

module.exports.update = function(collectionName, find, doc, callback) {
  this.getDB(function(error, db) {
    if (error) { callback(error); return };
    db.collection(collectionName).updateMany(find, { $set : doc }, function(error, result) {
      callback(error, result);
      db.close();
    });
  });
};

module.exports.remove = function(collectionName, find, callback) {
  this.getDB(function(error, db) {
    if (error) { callback(error); return };
    db.collection(collectionName).remove(find, function(error, result) {
      callback(error, result);
      db.close();
    });
  });
};

module.exports.id = function(objectId) {

  var id = null;

  try {
    id = mongodb.ObjectID(objectId);
  } catch (e) {
    console.log(e);
  }

  return id;
}
