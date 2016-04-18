var seedFns = require('./db/seeds/');

// *** routes *** //
var routes = require('./routes/index.js');
var membersRoutes = require('./routes/members.js');
var conversationsRoutes = require('./routes/conversations.js');
var matchesRoutes = require('./routes/matches.js');

module.exports = function (app) {
  // *** main routes *** //
  app.use('/gdating/', routes);
  app.use('/gdating/members', membersRoutes);

  // *** seed data if there is none *** //
  seedFns.begin();
}
