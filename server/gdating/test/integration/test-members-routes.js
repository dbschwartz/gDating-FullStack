process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();

var server = require('../../../app');
var testUtilities = require('../utilities');
var seed = require('../../db/seeds/test');

chai.use(chaiHttp);


describe('members routes', function() {

  beforeEach(function(done) {
    testUtilities.dropDatabase();
    seed.test(done);
  });

  afterEach(function(done) {
    testUtilities.dropDatabase(done);
  });

  describe('GET /gdating/members/ping', function() {
    it('should return a response', function(done) {
      chai.request(server)
      .get('/gdating/members/ping')
      .end(function(err, res) {
        res.status.should.equal(200);
        res.type.should.equal('application/json');
        res.body.should.be.a('object');
        res.body.should.have.property('message');
        res.body.message.should.equal('OK');
        done();
      });
    });
  });

  describe('GET /gdating/members', function() {
    it('should return all members', function(done) {
      chai.request(server)
      .get('/gdating/members')
      .end(function(err, res) {
        res.status.should.equal(200);
        res.type.should.equal('application/json');
        res.body.should.be.a('object');
        res.body.should.have.property('data');
        res.body.data.should.be.a('array');
        res.body.data[0].should.be.a('object');
        res.body.data[0].should.have.property('_id');
        res.body.data[0].should.have.property('email');
        res.body.data[0].should.have.property('active');
        res.body.data[0].should.have.property('admin');
        res.body.data[0].should.have.property('gender');
        done();
      });
    });
  });

});