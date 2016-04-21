var faker = require('faker');
var Promise = require('bluebird');
var db = require('../models');
var rand = require('./helpers').rand;

module.exports = seedData;

function seedData (num) {
  var promises = [];
  var toGenerate = num || 5000;

  for ( var i = 0; i < toGenerate; i++ ) {
    var conversation = constructConversation()
    .then(function (convo) {
      new db.Conversation(convo).save()
        .catch(function (error) {
          console.log('Error', error);
          return error;
        });
    });

    promises.push(conversation);
  };

  return Promise.all(promises);
};

function constructConversation () {
  return db.Member.count({})
  .then(function (memberCount) {
    var random1 = rand(memberCount);
    var random2 = rand(memberCount);
    var promises = [
      db.Member.findOne({}).select('_id').skip(random1),
      db.Member.findOne({}).select('_id').skip(random2)
    ];

    return Promise.all(promises);
  })
  .then(function (members) {
    var messages = [];
    var random = rand(10, 'ceil');
    for ( var i = 0; i < random; i++ ) {
      var sender = rand(2);
      messages.push({
        _sender: { _id: members[sender]._id },
        content: faker.lorem.words(i + sender + 1),
        timestamp: new Date()
      });
    };

    var conversation = {
      _members: [
        { _id: members[0]._id }, { _id: members[1]._id }
      ],
      messages: messages
    };

    return conversation;
  });
};
