'use strict';

var db = require('mongoskin').db('mongodb://localhost:27017/fr0stbyte', {safe:true});

db.collection('clients').find({ apiId: 'frost' }, { skip: 0, limit: 20 }).toArray(function(err, results) {
  console.log(results);
});

db.collection('clients').count({ fields: [  { _id: 1 } ] }, function(err, results) {
  console.log(results);
});
