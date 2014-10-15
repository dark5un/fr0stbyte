'use strict';

exports = module.exports = function(app) {
  var mongoose = app.db.adapters.mongoose;

  var queueSchema = new mongoose.Schema({
    name: { type: String, default: null },
    status: { type: String, default: null }
  });

  queueSchema.plugin(require('./plugins/pagedFind'));
  queueSchema.index({ name: 1 });
  queueSchema.index({ status: 1 });
  queueSchema.set('autoIndex', (app.get('env') === 'development'));
  app.db.mongoose.model('Queue', queueSchema);
};
