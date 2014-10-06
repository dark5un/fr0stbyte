'use strict';

exports = module.exports = function(app) {

  //route not found
  app.all('*', require('./views/http/index').http404);
};
