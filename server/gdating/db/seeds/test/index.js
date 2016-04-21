var db = require('../../models');
var seedConversations = require('./conversations');
var seedMembers = require('./members');
var seedMatches = require('./matches');

module.exports.test = function (done) {
  seedMembers(1)
  .then(function() {
    seedConversations(1)
    .then(function() {
      seedMatches(1)
      .then(function() {
        if(done) {
          done();
        }
      });
    });
  });
};