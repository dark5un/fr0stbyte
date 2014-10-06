'use strict';

exports.port = process.env.OPENSHIFT_NODEJS_PORT || 3000;
exports.ipAddress = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
exports.mongodb = {
  uri: process.env.OPENSHIFT_MONGODB_DB_URL + process.env.OPENSHIFT_APP_NAME || 'localhost/node'
};

exports.companyName = '';
exports.projectName = '';
exports.systemEmail = '';

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
