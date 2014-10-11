'use strict';
var _ = require('lodash');

var req = {
  query: {
    _a: 1,
    _b: 2,
    a: 3,
    b: 4
  }
};

var whereAttributeNames = _.filter(_.keys(req.query), function(item) {
  return item.match(/^_/) ? item : false;
});

var whereAttributes = _.map(whereAttributeNames, function(item) {
  var obj = {};
  obj[item.replace(/^_/, "")] = req.query[item];
  return obj;
});
console.log(whereAttributes);
