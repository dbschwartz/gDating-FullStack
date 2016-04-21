var colors = require('colors');
var db = require('../models');
var seedConversations = require('./conversations');
var seedMembers = require('./members');
var seedMatches = require('./matches');

module.exports.begin = function () {
  var promises = [
    db.Member.count({}),
    db.Conversation.count({})
  ];

  return Promise.all(promises)
    .then(function (result) {
      var total = result.reduce(function (prev, next) {
        return prev + next;
      });

      if ( !total ) {
        console.log('---------------------------'.blue);
        console.log('Checking for seeds...\n'.blue);
        return Promise.resolve('No existing data found.');
      } else {
        return Promise.reject('Existing data found.');
      };
    })
    .then(function (msg) {
      console.log(colors.underline(msg));
      console.log('Beginning to seed members...');

      return seedMembers();
    })
    .then(function () {
      console.log('Finished members.');
      console.log('Beginning to seed conversations...');

      return seedConversations();
    })
    .then(function () {
      console.log('Finished conversations.');
      console.log('Beginning to seed matches...');

      return seedMatches();
    })
    .then(function () {
      console.log('Finished matches.');
      console.log('\nSeed check complete.'.blue);
      console.log('---------------------------'.blue);
    })
    .catch(function () { console.log(colors.blue(msg)); });
};
