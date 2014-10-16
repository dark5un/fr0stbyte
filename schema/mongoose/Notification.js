'use strict';

exports = module.exports = function(app) {
  var mongoose = app.db.adapters.mongoose,
      ObjectId = mongoose.Schema.Types.ObjectId,
      Mixed = mongoose.Schema.Types.Mixed;

  var notificationSchema = new mongoose.Schema({
    client: {
      id: { type: ObjectId, ref: 'Client' }
    },
    payload: { type: Mixed, default: null },
    delivered: { type: Boolean, default: false },
    deliveredOn: { type: Date, default: null }
  });

  notificationSchema.plugin(require('./plugins/pagedFind'));
  notificationSchema.index({ apiId: 1 });
  notificationSchema.index({ createdOn: 1 });
  notificationSchema.set('autoIndex', (app.get('env') === 'development'));
  app.db.mongoose.model('Notification', notificationSchema);
};
