'use strict';

exports.index = function(req, res){
  res.status(200);
  if (req.xhr) {
    res.send({ error: 'Resource not found.' });
  }
  else {
    res.send(req.body);
  }
};
