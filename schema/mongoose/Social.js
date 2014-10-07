'use strict';

exports = module.exports = function(app) {
  var mongoose = app.db.adapters.mongoose,
      ObjectId = mongoose.Schema.Types.ObjectId;

  var socialSchema = new mongoose.Schema({
  });

  socialSchema.plugin(require('./plugins/pagedFind'));
  socialSchema.set('autoIndex', (app.get('env') === 'development'));
  app.db.mongoose.model('Social', socialSchema);
};
