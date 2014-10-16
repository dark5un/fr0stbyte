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
    encoding = app.config.hmac.encoding;

  it('should return the data record validated', function(done) {
    request(app)
      .post('/')
      .set('Accept', 'application/json')
      .set('Date', new Date().toString())
      .set('X-API-Authentication-Id', 'test-client')
      .set('X-API-Authentication-Secret', generateHmac(JSON.stringify(body), secret, algorithm, encoding))
      .expect(200)
      .send(body)
      .end(function(err, res) {
        should.not.exist(err);
        done();
      });
  });
});
