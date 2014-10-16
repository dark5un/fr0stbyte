'use strict';

// import the moongoose helper utilities
var utils = require('./util'),
  request = require('supertest'),
  should = require('should'),
  app = require('../app'),
  generateHmac = app.utility.hmac.generateHmac;

describe('hmac authentication', function() {
  var body = {
      a: 1,
      b: "test"
    },
    secret = app.config.hmac.secret,
    algorithm = app.config.hmac.algorithm,
    encoding = app.config.hmac.encoding,
    hmacSecret = generateHmac(JSON.stringify(body), secret, algorithm, encoding),
    headers = {
      "Accept": "application/json",
      "Date": new Date().toString(),
      "X-API-Authentication-Id": "test-client",
      "X-API-Authentication-Secret": hmacSecret
    };

  it('should return the data record validated', function(done) {
    request(app)
      .post('/')
      .set(headers)
      .expect(200)
      .send(body)
      .end(function(err, res) {
        should.not.exist(err);
        done();
      });
  });
});
