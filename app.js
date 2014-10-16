'use strict';

//dependencies
var config = require('./config'),
    express = require('express'),
    http = require('http'),
    path = require('path'),
    mongoose = require('mongoose'),
    helmet = require('helmet'),
    bodyParser = require('body-parser'),
    fs = require('fs'),
    morgan = require('morgan'),
    sequelize = require('sequelize'),
    mongoskin = require('mongoskin'),
    responseTime = require('response-time'),
    gcm = require('node-gcm'),
    apn = require('apn');

//create express app
var app = express();

//keep reference to config
app.config = config;

//setup the web server
app.server = http.createServer(app);

//setup utilities
app.utility = {};
app.utility.slugify = require('./util/slugify');
app.utility.workflow = require('./util/workflow');
app.utility.json = require('./util/json');
app.utility.outcome = require('./util/outcome');
app.utility.hmac = require('./util/hmac');

app.db = {
  adapters: {
    mongoose: mongoose,
    sequelize: sequelize,
    mongoskin: mongoskin
  }
};

//setup mongoose
app.db.mongoose = mongoose.createConnection(config.mongoose.uri);
app.db.mongoose.on('error', console.error.bind(console, 'mongoose connection error: '));
app.db.mongoskin = mongoskin.db(config.mongoskin.uri, {safe:true});

//setup notification service
app.notifications = {
  transport: {
    apn: apn,
    gcm: gcm
  }
};

//config data models
require('./models')(app);

//settings
app.disable('x-powered-by');
app.set('port', config.port);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//middleware
if (app.get('env') === 'development') {
  app.use(morgan('dev'));
}

if (app.get('env') === 'production') {
  var accessLogStream = fs.createWriteStream(path.join(__dirname, 'logs', 'access.log'), {flags: 'a'});
  app.use(morgan('combined', {stream: accessLogStream}));
}

app.use(require('compression')());
app.use(require('serve-static')(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json({ type: ["application/json", "application/*+json"]}));

app.use(require('method-override')());
app.use(helmet());
app.use(responseTime());

//global locals
app.locals.projectName = app.config.projectName;
app.locals.copyrightYear = new Date().getFullYear();
app.locals.copyrightName = app.config.companyName;

//setup message queue
require('./queues')(app);

//setup routing middleware
require('./middleware')(app);

//setup routes
require('./routes')(app);

//custom (friendly) error handler
app.use(require('./views/http/index').http500);

//listen up
app.server.listen(app.config.port, app.config.ipAddress, function(){
  //and... we're live
});

module.exports = app;
