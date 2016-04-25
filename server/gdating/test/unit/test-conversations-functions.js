process.env.NODE_ENV = 'test';

var chai = require('chai');
var should = chai.should();

var testUtilities = require('../utilities');
var seed = require('../../db/seeds/test');
var Member = require('../../db/models/conversation');

describe('conversations functions', function() {

  beforeEach(function(done) {
    testUtilities.dropDatabase();
    seed.test(done);
  });

  afterEach(function(done) {
    testUtilities.dropDatabase(done);
  });

});
