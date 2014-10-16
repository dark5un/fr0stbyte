'use strict';

exports.generateHmac = function(data, secretKey, algorithm, encoding) {
  var crypto = require('crypto');

  algorithm = algorithm || "sha256";
  encoding = encoding || "base64";
  return crypto.createHmac(algorithm, secretKey).update(data).digest(encoding);
};
