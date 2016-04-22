process.env.NODE_ENV = 'test';

var chai = require('chai');
var should = chai.should();

var db = require('../../db/models');
var testUtilities = require('../utilities');
var Member = require('../../db/models/member');
var data = require('./unit-test-data');


// functions to test (not exported by their home file)
function loopAndUpdate (obj, body) {
  for ( var key in body ) {
    if ( obj[key].constructor === Object ) {
      loopAndUpdate(obj[key], body[key]);
    } else {
      obj[key] = body[key];
    }
  }
  return obj;
}

function saveMember (body) {
  return function (member) {
    if ( !body || !member ) {
      var msg = { _id: 'The Member ID provided did not return a Member resource.' };
      return Promise.reject(msg);
    }
    var member = loopAndUpdate(member, body);
    return member.save();
  };
}

// necessary for running saveMember with correct data
function findMember () {
  return Member.findOne()
    .then(saveMember(changeSample))
}


// begin tests
describe('members functions', function() {

  describe('loopAndUpdate', function() {

    beforeEach(function(done) {
      testUtilities.dropDatabase();
      Member.collection.insert(data.user);
      done();
    });

    afterEach(function(done) {
      testUtilities.dropDatabase(done);
    });

    it('changes nothing if nothing is different', function(done) {
      loopAndUpdate(data.user, data.user).should.eql(data.user);
      done();
    });

    xit('loopAndUpdate updates first level keys')

    xit('loopAndUpdate updates second level keys')

    xit('loopAndUpdate updates third level keys')

    xit('loopAndUpdate updates arrays')

    xit('loopAndUpdate only updates a string with a string')

    xit('loopAndUpdate only updates a number with a number')

    xit('loopAndUpdate only updates an array with an array')

    xit('loopAndUpdate leaves an object\'s structure intact')

  });

  describe('saveMember', function() {

    beforeEach(function(done) {
      testUtilities.dropDatabase();
      Member.collection.insert(data.user);
    });

    afterEach(function(done) {
      testUtilities.dropDatabase(done);
    });

    xit('saveMember returns reject a message object without body')

    xit('saveMember returns reject a message object without member')

    xit('saveMember hashes password if it has been changed')

  });

});
