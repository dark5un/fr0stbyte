'use strict';

exports = module.exports = function(app) {

  app.get('/model/:model/', require('./views/model/index').find);
  app.all('/*', require('./views/index').index);
  //route not found
  app.all('*', require('./views/http/index').http404);
};
