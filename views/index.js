'use strict';

exports.index = function(req, res){
  res.status(200);
  if (req.xhr) {
    res.json(req.body);
  }
  else {
    res.json(req.body);
  }
};
