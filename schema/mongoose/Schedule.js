'use strict';

exports = module.exports = function(app) {
  var mongoose = app.db.adapters.mongoose;

  var scheduleSchema = new mongoose.Schema({
    name: { type: String, default: null },
    cron: {
      seconds: { type: String, default: null },
      minutes: { type: String, default: null },
      hours: { type: String, default: null },
      dayOfMonth: { type: String, default: null },
      months: { type: String, default: null },
      dayOfWeek: { type: String, default: null }
    },
    status: { type: String, default: null }
  });

  scheduleSchema.plugin(require('./plugins/pagedFind'));
  scheduleSchema.index({ name: 1 });
  scheduleSchema.index({ status: 1 });
  scheduleSchema.set('autoIndex', (app.get('env') === 'development'));
  app.db.mongoose.model('Schedule', scheduleSchema);
};
