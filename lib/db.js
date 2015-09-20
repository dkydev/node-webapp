var mongodb = require("mongodb");
var url = "mongodb://localhost:27017/nwa";

var self = module.exports;
module.exports.connect = function(callback) {
  mongodb.MongoClient.connect(url, function(error, client) {
    self.db = client;
    callback(error);
  });
};

module.exports.find = function(collectionName, find, callback) {
  self.db.collection(collectionName).find(find).toArray(function(error, docs) {
    callback(error, docs);
  });
};

module.exports.findOne = function(collectionName, find, callback) {
  self.db.collection(collectionName).findOne(find, function(error, doc) {
    callback(error, doc);
  });
};

module.exports.insert = function(collectionName, docs, callback) {
  if (Array.isArray(docs) && docs.length > 1) {
    self.db.collection(collectionName).insertMany(docs, function(error, result) {
      callback(error, result);
    });
  } else {
    self.db.collection(collectionName).insertOne(docs, function(error, result) {
      callback(error, result);
    });
  }
};

module.exports.update = function(collectionName, find, doc, callback) {
  self.db.collection(collectionName).updateMany(find, { $set : doc }, function(error, result) {
    callback(error, result);
  });
};

module.exports.remove = function(collectionName, find, callback) {
  self.db.collection(collectionName).remove(find, function(error, result) {
    callback(error, result);
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
