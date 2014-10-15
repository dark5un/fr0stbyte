'use strict';

exports = module.exports = function(app) {

  var fs        = require('fs'),
    path      = require('path'),
    plugins   = {};

  fs
    .readdirSync(path.join(__dirname, "plugins"))
    .filter(function(file) {
      return (file.indexOf('.') !== 0) && (file !== 'index.js');
    })
    .forEach(function(file) {
      plugins[file.replace(/\.js$/, "")] = require(path.join(__dirname, "plugins", file));
    });

  app.db.mongoskin.plugins = plugins;
};
