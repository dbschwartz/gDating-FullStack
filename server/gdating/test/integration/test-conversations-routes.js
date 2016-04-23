process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();

var server = require('../../../app');
var testUtilities = require('../utilities');
var seed = require('../../db/seeds/test');
var Member = require('../../db/models/member');

chai.use(chaiHttp);


describe('conversations routes', function() {

  beforeEach(function(done) {
    testUtilities.dropDatabase();
    seed.test(done);
  });

  afterEach(function(done) {
    testUtilities.dropDatabase(done);
  });

  describe('GET /gdating/members/:id/conversations', function() {
    it('should return a members\' conversations', function(done) {
      Member.findOne()
      .then(function(member) {
        var memberID = member._id;
        chai.request(server)
        .get('/gdating/members/'+ memberID + '/conversations')
        .end(function(err, res) {
          res.status.should.equal(200);
          res.type.should.equal('application/json');
          res.body.should.be.a('object');
          res.body.should.have.property('data');
          res.body.data.should.be.a('Array');
          res.body.data[0].should.have.property('_id');
          res.body.data[0].should.have.property('messages');
          res.body.data[0].should.have.property('_members');
          done();
        });
      });
    });
  });

  describe('POST /gdating/members/:id/conversations', function() {
    it('should return a members\' conversations', function(done) {
      Member.findOne()
      .then(function(member) {
        var memberID = member._id;
        chai.request(server)
        .post('/gdating/members/'+ memberID + '/conversations')
        .send({
            _recipient:1,
            content:"1"
          })
        .end(function(err, res) {
          res.status.should.equal(200);
          res.type.should.equal('application/json');
          res.body.should.be.a('object');
          res.body.should.have.property('data');
          res.body.data.should.be.a('Array');
          res.body.data[0].should.have.property('_id');
          res.body.data[0].should.have.property('messages');
          res.body.data[0].should.have.property('_members');
          done();
        });
      });
    });
  });

});