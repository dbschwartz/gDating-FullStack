process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();

var server = require('../../../app');
var testUtilities = require('../utilities');
var seed = require('../../db/seeds/test');
var Member = require('../../db/models/member');

chai.use(chaiHttp);


describe('gdating : routes : conversations', function() {

  beforeEach(function(done) {
    testUtilities.dropDatabase();
    seed.test(done);
  });

  afterEach(function(done) {
    testUtilities.dropDatabase(done);
  });

  describe('GET /gdating/members/:id/conversations/ping', function() {
    it('should return a response', function(done) {
      Member.findOne()
      .then(function(member) {
        chai.request(server)
        .get('/gdating/members/' + member._id + '/conversations/ping')
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

  describe('GET /gdating/members/:id/conversations', function() {
    it('should return a conversation between two members', function(done) {
      Member.find().limit(2)
      .then(function(members) {
        var member1 = members[0]._id;
        var member2 = members[1]._id;
        chai.request(server)
        .post('/gdating/members/'+ member1 + '/conversations')
        .send({
          _recipient: member2,
          content: "Hello World."
        })
        .end(function (err, res) {
          chai.request(server)
          .get('/gdating/members/' + member1 + '/conversations/' + member2)
          .end(function(err, res) {
            res.status.should.equal(200);
            res.type.should.equal('application/json');
            res.body.should.be.a('object');
            res.body.should.have.property('data');
            res.body.data.should.be.a('Array');
            res.body.data[0].should.have.property('_id');
            res.body.data[0].should.have.property('messages');
            res.body.data[0].should.have.property('_members');

            var messages = res.body.data[0].messages;
            messages[messages.length-1].content.should.equal('Hello World.');
            done();
          });
        });
      });
    });
  });

  describe('POST /gdating/members/:id/conversations', function() {
    it('should return a members\' conversations', function(done) {
      Member.find().limit(2)
      .then(function(members) {
        var member1 = members[0]._id;
        var member2 = members[1]._id;
        chai.request(server)
        .post('/gdating/members/'+ member1 + '/conversations')
        .send({
            _recipient: member2,
            content: "Hello World."
          })
        .end(function(err, res) {
          res.status.should.equal(201);
          res.type.should.equal('application/json');
          res.body.should.be.a('object');
          res.body.should.have.property('data');
          res.body.data.should.be.a('Object');
          res.body.data.should.have.property('_id');
          res.body.data.should.have.property('messages');
          res.body.data.should.have.property('_members');
          done();
        });
      });
    });
  });

});
