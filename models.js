'use strict';

exports = module.exports = function(app) {
  //mongoose models
  require('./schema/mongoose/Secret')(app);
  require('./schema/mongoose/Client')(app);

  // relational database data
  require('./schema/sequelize')(app);
};
