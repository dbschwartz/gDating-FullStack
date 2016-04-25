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

  describe('loopAndUpdate', () => {

    it('changes nothing if nothing is different', (done) => {
      loopAndUpdate(data.user, data.user).should.eql(data.user);
      done();
    });

    it('updates first level keys', (done) => {
      loopAndUpdate(data.user, data.updateFirstLevelKeys).should.eql(data.updateFirstLevelKeys);
      done();
    });

    it('updates second level keys', (done) => {
      loopAndUpdate(data.user, data.updateSecondLevelKeys).should.eql(data.updateSecondLevelKeys);
      done();
    })

    it('updates third level keys', (done) => {
      loopAndUpdate(data.user, data.updateThirdLevelKeys).should.eql(data.updateThirdLevelKeys);
      done();
    })

    it('updates arrays', (done) => {
      loopAndUpdate(data.user, data.updateArray).should.eql(data.updateArray);
      done();
    });

    it('only updates a string with a string', (done) => {
      loopAndUpdate(data.user, data.updateCoerceString).should.eql(data.user);
      done();
    });

    it('only updates a number with a number', (done) => {
      loopAndUpdate(data.user, data.updateCoerceNumber).should.eql(data.user);
      done();
    });

    it('only updates an array with an array', (done) => {
      loopAndUpdate(data.user, data.updateCoerceArray).should.eql(data.user);
      done();
    });

    it('leaves an object\'s structure intact', (done) => {
      loopAndUpdate(data.user, data.updateCoerceObject).should.eql(data.user);
      done();
    });

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
