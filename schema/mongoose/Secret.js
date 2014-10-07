'use strict';

exports = module.exports = function(app) {
  var mongoose = app.db.adapters.mongoose,
      moment = require('moment');

  var secretSchema = new mongoose.Schema({
    secret: { type: String, default: app.config.hmac.secret },
    createdOn: { type: Date, default: moment().utc().toDate() }
  });

  secretSchema.static('latest', function(callback) {
    return this.findOne({}, "secret", {sort: {createdOn: -1 }}, callback);
  });

  secretSchema.plugin(require('./plugins/pagedFind'));
  secretSchema.index({ createdOn: 1 });
  secretSchema.set('autoIndex', (app.get('env') === 'development'));
  app.db.mongoose.model('Secret', secretSchema);
};
