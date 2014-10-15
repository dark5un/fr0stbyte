'use strict';

exports = module.exports = function(app) {
  //mongoose models
  require('./schema/mongoose/Secret')(app);
  require('./schema/mongoose/Client')(app);

  //mongoskin stealth models/plugins
  require('./schema/mongoskin')(app);

  // relational database data
  require('./schema/sequelize')(app);
};
