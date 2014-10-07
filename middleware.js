'use strict';
exports = module.exports = function(app) {

  var crypto = require("crypto"),
      async = require("async"),
      moment = require("moment");

  function generateHmac(data, secretKey, algorithm, encoding) {
    encoding = encoding || "base64";
    algorithm = algorithm || "sha256";
    return crypto.createHmac(algorithm, secretKey).update(data).digest(encoding);
  }

  // RFC 2104 authentication
  app.use(function(req, res, next) {
    async.waterfall([
      function(callback) {
        // This cache will speed up things and will offload mongodb
        if(app.config.hmac.nextCheck &&
          app.config.hmac.secret &&
          moment().isBefore(app.config.hmac.nextCheck)) {
          callback(null, app.config.hmac.secret);
        } else {
          app.db.mongoose.models.Secret.latest(function(error, record) {
            if(error) { callback(error); }

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
        var body = app.utility.json.isJSON(req.body) ? JSON.stringify(req.body) : "",
          reqKey = req.get("X-API-Authentication-Secret"),
          reqId = req.get("X-API-Authentication-Id"),
          calcKey = generateHmac(body, secret);

          if (reqKey === calcKey) {
            req.hmac = {
              id: reqId,
              key: reqKey
            };
            return next();
          }

          res.status(404).json(app.utility.outcome.build());
      });
  });
};
