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

    beforeEach(function(done) {
      testUtilities.dropDatabase();
      Member.collection.insert(data.user);
      done();
    });

    afterEach(function(done) {
      testUtilities.dropDatabase(done);
    });

    it('changes nothing if nothing is different', (done) => {
      loopAndUpdate(data.user, data.user).should.eql(data.user);
      done();
    });

    it('loopAndUpdate updates first level keys', (done) => {
      loopAndUpdate(data.user, data.updateFirstLevelKeys).should.equal(data.updateFirstLevelKeys);
      done();
    });

    xit('loopAndUpdate updates second level keys', (done) => {
      loopAndUpdate(data.user, data.updateSecondLevelKeys).should.equal(data.updateSecondLevelKeys);
      done();
    })

    xit('loopAndUpdate updates third level keys', (done) => {
      loopAndUpdate(data.user, data.updateThirdLevelKeys).should.equal(data.updateThirdLevelKeys);
      done();
    })

    xit('loopAndUpdate updates arrays', (done) => {
      loopAndUpdate(data.user, data.updateArray).should.equal(data.updateArray);
      done();
    });

    xit('loopAndUpdate only updates a string with a string', (done) => {
      loopAndUpdate(data.user, data.updateCoerceString).should.equal(data.updateCoerceString);
      done();
    });

    xit('loopAndUpdate only updates a number with a number', (done) => {
      loopAndUpdate(data.user, data.updateCoerceNumber).should.equal(data.updateCoerceNumber);
      done();
    });

    xit('loopAndUpdate only updates an array with an array', (done) => {
      loopAndUpdate(data.user, data.updateCoerceArray).should.equal(data.updateCoerceArray);
      done();
    })

    xit('loopAndUpdate leaves an object\'s structure intact', (done) => {
      loopAndUpdate(data.user, data.updateCoerceObject).should.equal(data.updateCoerceObject);
      done();
    })

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
