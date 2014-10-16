'use strict';

exports.port = process.env.OPENSHIFT_NODEJS_PORT || 3000;
exports.ipAddress = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

var mongodb = {
  name: 'fr0stbyte'
};
exports.mongodb = mongodb;

exports.mongoose = {
  uri: process.env.OPENSHIFT_MONGODB_DB_URL + process.env.OPENSHIFT_APP_NAME || 'localhost/' + mongodb.name
};
exports.mongoskin = {
  uri: process.env.OPENSHIFT_MONGODB_DB_URL + process.env.OPENSHIFT_APP_NAME || 'mongodb://localhost/' + mongodb.name
};

exports.companyName = '';
exports.projectName = '';
exports.systemEmail = '';

exports.apn = {
  key: process.env.APN_KEY || null
};

exports.gcm = {
  key: process.env.GCM_KEY || null
};

exports.hmac = {
  secret: process.env.SERVER_SECRET || '1234567890',
  check: {
    amount: 2,  // Number
    type: 'minutes'   // moment.js manipulation key ["years", "months", "minutes"] etc.
  },
  encoding: "base64",
  algorithm: "sha256",
  validFor: { // additional security for request replay
    amount: 1,  // Number
    type: 'minutes'   // moment.js manipulation key ["years", "months", "minutes"] etc.
  }
};

exports.queue = {
  redis: {
    host: process.env.OPENSHIFT_REDIS_HOST || 'localhost',
    port: process.env.OPENSHIFT_REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || null
  },
  enabled: true // set to false if you do not need a message queue
};

exports.smtp = {
  from: {
    name: process.env.SMTP_FROM_NAME || exports.projectName +' Website',
    address: process.env.SMTP_FROM_ADDRESS || 'info@example.com'
  },
  credentials: {
    user: process.env.SMTP_USERNAME || 'your@example.com',
    password: process.env.SMTP_PASSWORD || '',
    host: process.env.SMTP_HOST || 'smtp.example.com',
    ssl: true
  }
};
