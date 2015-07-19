module.exports.process = function(req, res) {
  var component = "default";
  var actionMap = {
    
    "list" : function(req, res) {
      
      res.send("default list");
      
    },
      
  };

  var action = req.params.action || "list";
  return actionMap[action](req, res);
};
