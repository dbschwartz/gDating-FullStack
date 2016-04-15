// *** main dependencies *** //
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var db = require('./db/models');

// *** routes *** //
var routes = require('./routes/index.js');
var membersRoutes = require('./routes/members.js');
var conversationsRoutes = require('./routes/conversations.js');
var matchesRoutes = require('./routes/matches.js');

// *** express instance *** //
var app = express();


// *** config middleware *** //
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


// *** main routes *** //
app.use('/', routes);
app.use('/members', membersRoutes);
app.use('/conversations', conversationsRoutes);
app.use('/matches', matchesRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// *** error handlers *** //

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send({ message: err.message });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send({ message: err.message });
});


module.exports = app;
