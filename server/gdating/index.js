var seedFns = require('./db/seeds/');

// *** routes *** //
var routes = require('./routes/index.js');
var authRoutes = require('./routes/auth.js');
var membersRoutes = require('./routes/members.js');

module.exports = function (app) {
  // *** main routes *** //
  app.use('/gdating', routes);
  app.use('/gdating/auth', authRoutes);
  app.use('/gdating/members', membersRoutes);

  // *** seed data if there is none *** //
  if (process.env.NODE_ENV !== 'test') {
    seedFns.begin();
  }
};
