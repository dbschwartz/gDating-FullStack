process.env.NODE_ENV = 'test';

var chai = require('chai');
var should = chai.should();

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

  beforeEach(function(done) {
    testUtilities.dropDatabase();
    Member.insert(data.user);
  });

  afterEach(function(done) {
    testUtilities.dropDatabase(done);
  });

  describe('loopAndUpdate changes nothing if nothing is different')

  describe('loopAndUpdate updates first level keys')

  describe('loopAndUpdate updates second level keys')

  describe('loopAndUpdate updates third level keys')

  describe('loopAndUpdate updates arrays')

  describe('loopAndUpdate only updates a string with a string')

  describe('loopAndUpdate only updates a number with a number')

  describe('loopAndUpdate only updates an array with an array')

  describe('loopAndUpdate leaves an object\'s structure intact')

  describe('saveMember returns reject a message object without body')

  describe('saveMember returns reject a message object without member')

  describe('saveMember hashes password if it has been changed')


});
