'use strict';

exports = module.exports = function(app) {
  var mongoose = app.db.adapters.mongoose,
      ObjectId = mongoose.Schema.Types.ObjectId;

  var userSchema = new mongoose.Schema({
  });

  userSchema.plugin(require('./plugins/pagedFind'));
  userSchema.set('autoIndex', (app.get('env') === 'development'));
  app.db.mongoose.model('User', userSchema);
};
