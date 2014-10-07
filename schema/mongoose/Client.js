'use strict';

exports = module.exports = function(app) {
  var mongoose = app.db.adapters.mongoose,
      moment = require('moment');

  var clientSchema = new mongoose.Schema({
    apiId: { type: String, default: null },
    updatedOn: { type: Date, default: moment().utc().toDate() }
  });

  clientSchema.plugin(require('./plugins/pagedFind'));
  clientSchema.index({ apiId: 1 });
  clientSchema.index({ createdOn: 1 });
  clientSchema.set('autoIndex', (app.get('env') === 'development'));
  app.db.mongoose.model('Client', clientSchema);
};
