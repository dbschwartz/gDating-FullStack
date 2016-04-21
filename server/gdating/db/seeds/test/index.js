var db = require('../../models');
var seedConversations = require('../conversations');
var seedMembers = require('../members');
var seedMatches = require('../matches');

module.exports.test = function (done) {
  seedMembers(5)
  .then(function() {
    seedConversations(5)
    .then(function() {
      seedMatches(5)
      .then(function() {
        if(done) {
          done();
        }
      });
    });
  });
};
