'use strict';

exports.http404 = function(req, res) {
  console.log(req.app.utility);
  res.status(404);
  if (req.xhr) {
    res.send(req.app.utility.outcome.build(null, false, ['Resource not found.']));
  }
  else {
    res.send(req.app.utility.outcome.build(null, false, ['Resource not found.']));
  }
};

exports.http500 = function(err, req, res, next) {
  console.log(req.app.utility);
  res.status(500);

  var data = { err: {} };
  if (req.app.get('env') === 'development') {
    data.err = err;
    console.log(err.stack);
  }

  if (req.xhr) {
    res.send(req.app.utility.outcome.build(null, false, ['Something went wrong.'], data));
  }
  else {
    res.send(req.app.utility.outcome.build(null, false, ['Something went wrong.'], data));
  }
};
