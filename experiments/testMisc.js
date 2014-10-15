'use strict';

var crypto = require('crypto'),
    request = require('request'),
    config = require('../config'),
    moment = require('moment');

var isJSON = function (value) {
  try {
    JSON.stringify(value);
    return true;
  } catch (ex) {
    return false;
  }
};

function generateHmac(data, secretKey, algorithm, encoding) {
  encoding = encoding || "base64";
  algorithm = algorithm || "sha256";
  return crypto.createHmac(algorithm, secretKey).update(data).digest(encoding);
}

var data = {
  record: {
    _id: 1,
    value: 'test'
  }
};

var options = {
  url: 'http://localhost:3000/model/test_model',
  method: "POST",
  headers: {
    "X-API-Authentication-Secret": generateHmac(JSON.stringify(data), config.hmac.secret),
    "X-API-Authentication-Id": "panos",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
    "Date": moment().utc().format()
  },
  body: JSON.stringify(data)
};


// request(options, function(error, response, body) {
//   console.log({
//     error: error,
//     responseHeaders: response.headers,
//     body: body
//   });
// });

options = {
  url: 'http://localhost:3000/model/test_model/1',
  method: "GET",
  headers: {
    "X-API-Authentication-Secret": generateHmac("panos", config.hmac.secret),
    "X-API-Authentication-Id": "panos",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
    "Date": moment().utc().format()
  }
};

request(options, function(error, response, body) {
  console.log({
    error: error,
    responseHeaders: response.headers,
    body: body
  });
});

data.record.value = "other";

options = {
  url: 'http://localhost:3000/model/test_model/1',
  method: "PUT",
  headers: {
    "X-API-Authentication-Secret": generateHmac(JSON.stringify(data), config.hmac.secret),
    "X-API-Authentication-Id": "panos",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
    "Date": moment().utc().format()
  },
  body: JSON.stringify(data)
};

// request(options, function(error, response, body) {
//   console.log({
//     error: error,
//     responseHeaders: response.headers,
//     body: body
//   });
// });
