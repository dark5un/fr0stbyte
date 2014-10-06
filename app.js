'use strict';

//dependencies
var config = require('./config'),
    express = require('express'),
    http = require('http'),
    path = require('path'),
    mongoose = require('mongoose'),
    helmet = require('helmet'),
    bodyParser = require('body-parser');

//create express app
var app = express();

//keep reference to config
app.config = config;

//setup the web server
app.server = http.createServer(app);

app.db = {
  adapters: {
    mongoose: mongoose
  }
};

//setup mongodb
app.db.mongodb = mongoose.createConnection(config.mongodb.uri);
app.db.mongodb.on('error', console.error.bind(console, 'nosql connection error: '));
app.db.mongodb.once('open', function () {
  console.log("connected to mongodb: ");
});

//config data models
require('./models')(app);

//settings
app.disable('x-powered-by');
app.set('port', config.port);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//middleware
app.use(require('morgan')('dev'));
app.use(require('compression')());
app.use(require('serve-static')(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.use(require('method-override')());
app.use(helmet());

//global locals
app.locals.projectName = app.config.projectName;
app.locals.copyrightYear = new Date().getFullYear();
app.locals.copyrightName = app.config.companyName;
app.locals.cacheBreaker = 'br34k-01';

//setup routes
require('./routes')(app);

//custom (friendly) error handler
app.use(require('./views/http/index').http500);

//setup utilities
app.utility = {};
app.utility.slugify = require('./util/slugify');
app.utility.workflow = require('./util/workflow');

//listen up
app.server.listen(app.config.port, app.config.ipAddress, function(){
  //and... we're live
});
