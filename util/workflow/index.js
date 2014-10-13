  //
	//        Workflow
  // An event based way to organize
  // responses.Imported from drywall
  //


exports = module.exports = function(req, res) {
  'use strict';
  var workflow = new (require('events').EventEmitter)();

  workflow.outcome = {
    success: false,
    errors: [],
    errfor: {}
  };

  workflow.hasErrors = function() {
    return Object.keys(workflow.outcome.errfor).length !== 0 || workflow.outcome.errors.length !== 0;
  };

  workflow.on('exception', function(error) {
    workflow.outcome.errors.push('Exception: '+ error);
    return workflow.emit('response');
  });

  workflow.on('response', function() {
    workflow.outcome.success = !workflow.hasErrors();
    if (req.xhr) {
      res.json(workflow.outcome);
    } else {
      res.send(workflow.outcome);
    }
  });

  return workflow;
};
