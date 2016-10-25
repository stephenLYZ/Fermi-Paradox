var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compress = require('compression');

var routes = require('./routes.js');

var app = express();

app.use(compress());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, '../public/favicon.ico')));


app.use(express.static(path.join(__dirname, '../public')));

app.use('/api/', routes);



module.exports = app;
