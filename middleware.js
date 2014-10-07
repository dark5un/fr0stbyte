'use strict';
exports = module.exports = function(app) {

  var crypto = require('crypto'),
    async = require('async'),
    moment = require('moment');

  function generateHmac(data, secretKey, algorithm, encoding) {
    encoding = encoding || app.config.hmac.encoding;
    algorithm = algorithm || app.config.hmac.algorithm;
    return crypto.createHmac(algorithm, secretKey).update(data).digest(encoding);
  }

  // RFC 2104 authentication

  // Date restriction
  app.use(function(req, res, next) {
    var reqDate = req.get("Date");
    if (moment().add(app.config.hmac.validFor.amount, app.config.hmac.validFor.type)
      .utc().isAfter(moment(reqDate))) {
      req.hmac = {
        date: reqDate
      };
      return next();
    } else {
      res.status(404).json(app.utility.outcome.build());
    }
  });

  // Id restriction
  app.use(function(req, res, next) {
    var reqId = req.get("X-API-Authentication-Id");
    if (reqId) {
      async.waterfall([
          function(callback) {
            app.db.mongoose.models.Client.update({
                apiId: reqId
              }, {
                updatedOn: moment().utc().toDate()
              }, {
                upsert: true
              },
              function(error, numberAffected, raw) {
                if (error) {
                  callback(error);
                } else {
                  callback(null);
                }
              }
            );
          }
        ],
        function(error) {
          if (error) {
            res.status(500).json(app.utility.outcome.build());
          } else {
            req.hmac.id = reqId;
            return next();
          }
        });
    } else {
      res.status(404).json(app.utility.outcome.build());
    }
  });

  // Key calculation
  app.use(function(req, res, next) {
    async.waterfall([
        function(callback) {
          // This cache will speed up things and will offload mongodb
          if (app.config.hmac.nextCheck &&
            app.config.hmac.secret &&
            moment().isBefore(app.config.hmac.nextCheck)) {
            callback(null, app.config.hmac.secret);
          } else {
            app.db.mongoose.models.Secret.latest(function(error, record) {
              if (error) {
                callback(error);
              }

              app.config.hmac.secret = (record && record.secret) ?
                record.secret : app.config.hmac.secret;
              app.config.hmac.nextCheck = moment()
                .add(app.config.hmac.check.amount, app.config.hmac.check.type);
              callback(null, app.config.hmac.secret);
            });
          }
        }
      ],
      function(error, secret) {
        if (error) {
          res.status(500).json(app.utility.outcome.build());
        } else {
          var body = app.utility.json.isJSON(req.body) ? JSON.stringify(req.body) : "",
            reqKey = req.get("X-API-Authentication-Secret"),
            calcKey = generateHmac(body, secret);

          if (reqKey === calcKey) {
            req.hmac.key = reqKey;
            return next();
          }

          res.status(404).json(app.utility.outcome.build());
        }
      });
  });
};
