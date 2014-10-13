'use strict';
var _ = require('lodash');

// var req = {
//   query: {
//     _a: 1,
//     _b: 2,
//     a: 3,
//     b: 4
//   }
// };
//
// var whereAttributeNames = _.filter(_.keys(req.query), function(item) {
//   return item.match(/^_/) ? item : false;
// });
//
// var whereAttributes = _.map(whereAttributeNames, function(item) {
//   var obj = {};
//   obj[item.replace(/^_/, "")] = req.query[item];
//   return obj;
// });
// console.log(whereAttributes);


 var a = [{ name: 'fr0stbyte.secrets' },
  { name: 'fr0stbyte.system.indexes' },
  { name: 'fr0stbyte.clients' },
  { name: 'fr0stbyte.test_model' } ];

  var x = _.map(a, function(item) {
    return _.pluck(item, "name");
  });

  var y = _.pluck(a, "name");

  console.log(y);
