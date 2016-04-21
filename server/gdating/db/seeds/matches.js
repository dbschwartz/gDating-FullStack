var faker = require('faker');
var Promise = require('bluebird');
var Member = require('../models').Member;
var rand = require('./helpers').rand;

module.exports = seedData;

function seedData (num) {
  var promises = [];
  var toGenerate = num || 5000;

  for ( var i = 0; i < toGenerate; i++ ) {
    var match = constructMatch()
    .catch(function (error) {
      console.log('Error', error);
      return error;
    });

    promises.push(match);
  };

  return Promise.all(promises);
};

function constructMatch () {
  return Member.count({})
  .then(function (memberCount) {
    var random1 = rand(memberCount);
    var random2 = rand(memberCount);
    var promises = [
      Member.findOne({}).select('_id').skip(random1),
      Member.findOne({}).select('_id').skip(random2)
    ];

    return Promise.all(promises);
  })
  .then(function (members) {
    var query = { _id: members[0]._id };
    var options = { new: true, runValidators: true, setDefaultsOnInsert: true };

    return Member.findOneAndUpdate(query, {
      $addToSet: { _matches: { _id: members[1]._id } }
    }, options);
  });
};
