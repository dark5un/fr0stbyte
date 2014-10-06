'use strict';

exports = module.exports = function(app) {
  //embeddable docs first
  require('./schema/mongodb/User')(app);

  // relational database data
  require('./schema/rdbms')(app);
};
