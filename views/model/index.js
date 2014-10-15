'use strict';

exports.find = function(req, res, next) {
  var _ = require('lodash'),
    workflow = req.app.utility.workflow(req, res),
    model = req.params.model ? req.params.model : null;

  workflow.on('validate', function() {
    if (!model) {
      return workflow.emit('exception', 'Empty model found.');
    }

    req.app.db.mongoskin.collectionNames(function(err, models) {
      var targetModel = req.app.config.mongodb.name + '.' + model;

      if (_.contains(_.pluck(models, "name"), targetModel)) {
        workflow.emit('find');
      } else {
        return workflow.emit('exception', 'Unknown model.');
      }
    });
  });

  workflow.on('find', function() {
    req.query.keys = req.query.keys ? req.query.keys : '';
    req.query.limit = req.query.limit ? parseInt(req.query.limit, null) : 20;
    req.query.page = req.query.page ? parseInt(req.query.page, null) : 1;
    req.query.sort = req.query.sort ? req.query.sort : '_id';

    req.query.where = _.reduce(_.pick(req.query, function(value, key) {
      return key.charAt(0) === "_";
    }), function(result, value, key) {
      result[key.replace(/^_/, '')] = value;
      return result;
    }, {});

    var filters = {};
    if (req.query.where) {
      filters = req.query.where;
    }

    req.app.db.mongoskin.plugins.pagedFind(req.app, model, {
      filters: filters,
      keys: req.query.keys,
      limit: req.query.limit,
      page: req.query.page,
      sort: req.query.sort
    }, function(error, results) {
      if (error) {
        return workflow.emit('exception', error);
      }

      results.filters = req.query;
      workflow.outcome.record = results;

      return workflow.emit('response');
    });
  });

  workflow.emit('validate');

};

exports.read = function(req, res, next) {
  var _ = require('lodash'),
    workflow = req.app.utility.workflow(req, res),
    model = req.params.model ? req.params.model : null,
    collection = null;

  workflow.on('validate', function() {
    if (!model) {
      return workflow.emit('exception', 'Empty model found.');
    }

    req.app.db.mongoskin.collectionNames(function(err, models) {
      var targetModel = req.app.config.mongodb.name + '.' + model;

      if (_.contains(_.pluck(models, "name"), targetModel)) {
        collection = req.app.db.mongoskin.collection(model);
        workflow.emit('find');
      } else {
        return workflow.emit('exception', 'Unknown model.');
      }
    });
  });

  workflow.on('find', function() {
    req.query.keys = req.query.keys ? req.query.keys : null;
    req.params.id = req.params.id ? req.params.id : null;

    var findOptions = req.query.keys ? {
      fields: _.reduce(req.query.keys.split(","), function(result, value) {
        result[value] = 1;
        return result;
      }, {})
    } : {};

    console.log(collection);
    collection.findOne({
      _id: req.params.id
    }, findOptions, function(error, document) {
      if (error) {
        return workflow.emit('exception', error);
      }

      workflow.outcome.record = document;
      return workflow.emit('response');
    });

  });

  workflow.emit('validate');
};

exports.create = function(req, res, next) {
  var workflow = req.app.utility.workflow(req, res),
    _ = require('lodash'),
    model = req.params.model ? req.params.model : null,
    collection = null;

  workflow.on('validate', function() {
    if (!model) {
      return workflow.emit('exception', 'Empty model found.');
    }

    if (req.body === {}) {
      return workflow.emit('exception', 'Empty body found.');
    }

    if (!req.body.record) {
      return workflow.emit('exception', 'No record found');
    }
    workflow.emit('duplicateDataCheck');
  });

  workflow.on('duplicateDataCheck', function() {
    collection = req.app.db.mongoskin.collection(model);

    req.query.where = _.reduce(_.pick(req.query, function(value, key) {
      return key.charAt(0) === "_";
    }), function(result, value, key) {
      result[key.replace(/^_/, '')] = value;
      return result;
    }, {});

    req.query.keys = req.query.keys ? req.query.keys : null;

    console.log({
      where: req.query.where
    });
    if (req.query.where !== {}) {
      collection.findOne(req.query.where, function(error, record) {
        if (error) {
          return workflow.emit('exception', error);
        }
        if (record) {
          return workflow.emit('exception', 'Duplicate record found');
        } else {
          workflow.emit('create');
        }
      });
    } else {
      workflow.emit('create');
    }
  });

  workflow.on('create', function() {
    var fieldsToSet = req.body.record;

    collection.insert(fieldsToSet, function(error, result) {
      if (error) {
        return workflow.emit('exception', error);
      }
      workflow.outcome.record = result;
      return workflow.emit('response');
    });
  });

  workflow.emit('validate');
};

exports.update = function(req, res, next) {
  var workflow = req.app.utility.workflow(req, res),
    _ = require('lodash'),
    model = req.params.model ? req.params.model : null,
    collection = null;

  req.params.id = req.params.id ? req.params.id : null;

  workflow.on('validate', function() {
    if (!model) {
      workflow.outcome.errors.push('Empty model found.');
      return workflow.emit('response');
    }

    if (req.body === {}) {
      return workflow.emit('exception', 'Empty body found.');
    }

    if (!req.body.record) {
      return workflow.emit('exception', 'No record found');
    }

    req.app.db.mongoskin.collectionNames(function(err, models) {
      var targetModel = req.app.config.mongodb.name + '.' + model;

      if (_.contains(_.pluck(models, "name"), targetModel)) {
        collection = req.app.db.mongoskin.collection(model);
        workflow.emit('checkIfExists');
      } else {
        return workflow.emit('exception', 'Unknown model.');
      }
    });
  });

  workflow.on('checkIfExists', function() {
    collection.findOne({
      _id: req.params.id
    }, function(error, record) {
      if (error) {
        return workflow.emit('exception', error);
      }
      if (!record) {
        return workflow.emit('exception', 'Record not found');
      }
      workflow.emit('update');
    });
  });

  workflow.on('update', function(record) {
    var fieldsToSet = req.body.record;

    collection.update({
      _id: req.params.id
    }, fieldsToSet, function(error, result) {
      if (error) {
        return workflow.emit('exception', error);
      }
      workflow.outcome.record = result;
      return workflow.emit('response');
    });
  });

  workflow.emit('validate');
};

exports.delete = function(req, res, next) {
  var _ = require('lodash'),
    workflow = req.app.utility.workflow(req, res),
    model = req.params.model ? req.params.model : null,
    collection = null;

  workflow.on('validate', function() {
    if (!model) {
      return workflow.emit('exception', 'Empty model found.');
    }

    req.app.db.mongoskin.collectionNames(function(err, models) {
      var targetModel = req.app.config.mongodb.name + '.' + model;

      if (_.contains(_.pluck(models, "name"), targetModel)) {
        collection = req.app.db.mongoskin.collection(model);
        workflow.emit('delete');
      } else {
        return workflow.emit('exception', 'Unknown model.');
      }
    });
  });

  workflow.on('delete', function() {
    req.query.keys = req.query.keys ? req.query.keys : '';
    req.params.id = req.params.id ? req.params.id : null;

    collection.remove({
      _id: req.params.id
    }, function(error, count) {
      if (error) {
        return workflow.emit('exception', error);
      }

      workflow.outcome.record = {
        count: count
      };
      return workflow.emit('response');
    });

  });

  workflow.emit('validate');
};
