'use strict';

var crypto = require('crypto'),
    request = require('request'),
    config = require('../config'),
    moment = require('moment');

function generateHmac(data, secretKey, algorithm, encoding) {
  encoding = encoding || "base64";
  algorithm = algorithm || "sha256";
  return crypto.createHmac(algorithm, secretKey).update(data).digest(encoding);
}

var data = JSON.stringify({
  id: 1,
  value: 'test'
});

var options = {
  url: 'http://localhost:3000/',
  method: "POST",
  headers: {
    "X-API-Authentication-Secret": generateHmac(data, config.hmac.secret),
    "X-API-Authentication-Id": "frost",
    "Content-Type": "application/json",
    "Date": moment().utc().format()
  },
  body: data
};

console.log(options);

request(options, function(error, response, body) {
  console.log({
    error: error,
    responseHeaders: response.headers,
    body: body
  });
});
