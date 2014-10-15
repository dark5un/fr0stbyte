'use strict';

exports = module.exports = function(app) {

  // stealth model handling
  app.get('/model/:model/:id/', require('./views/model/index').read);
  //app.get('/model/:model/', require('./views/model/index').find);
  app.post('/model/:model/', require('./views/model/index').create);
  app.put('/model/:model/:id/', require('./views/model/index').update);
  app.delete('/model/:model/:id/', require('./views/model/index').delete);

  app.all('/*', require('./views/index').index);
  //route not found
  app.all('*', require('./views/http/index').http404);
};
