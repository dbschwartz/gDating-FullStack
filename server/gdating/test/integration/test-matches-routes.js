process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();

var server = require('../../../app');
var testUtilities = require('../utilities');
var seed = require('../../db/seeds/test');
var Member = require('../../db/models/member');

chai.use(chaiHttp);

describe('matches routes', function() {

  beforeEach(function(done) {
    testUtilities.dropDatabase();
    seed.test(done);
  });

  afterEach(function(done) {
    testUtilities.dropDatabase(done);
  });

  describe('GET /gdating/members/:id/matches/ping', function() {
    it('should return a response', function(done) {
      Member.findOne()
      .then(function (member) {
        chai.request(server)
        .get('/gdating/members/' + member._id + '/matches/ping')
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

  describe('GET /gdating/members/:id/matches', function() {
    it('should return matches for the member', function(done) {
      Member.find()
      .then(function (members) {
        var member = members[0];
        var matches = members.reduce(function (acc, curr) {
          if ( curr._matches.indexOf(member._id) >= 0 ) {
            acc.push(curr._id.toString());
          }

          return acc;
        }, []);

        chai.request(server)
        .get('/gdating/members/' + member._id + '/matches')
        .end(function(err, res) {
          res.status.should.equal(200);
          res.type.should.equal('application/json');
          res.body.should.be.a('object');
          res.body.should.have.property('data');
          res.body.data.should.be.a('array');
          res.body.data.map(function (match) {
            return match._id.toString();
          }).forEach(function (match) {
            matches.should.include(match.toString());
          });

          done();
        });
      });
    });
  });

  describe('POST /gdating/members/:id/matches', function() {
    it('should create a new match for the member', function(done) {
      Member.find().limit(2)
      .then(function (members) {
        chai.request(server)
        .post('/gdating/members/' + members[0]._id + '/matches')
        .send({
          _match: members[1]._id
        })
        .end(function(err, res) {
          res.status.should.equal(201);
          res.type.should.equal('application/json');
          res.body.should.be.a('object');
          res.body.should.have.property('data');
          res.body.data.should.be.a('object');
          res.body.data._matches.map(function (match) {
            return match.toString();
          }).should.include(members[1]._id.toString());

          done();
        });
      });
    });
  });

  describe('DELETE /gdating/members/:id/matches/:matchId', function() {
    it('should create a new match for the member', function(done) {
      Member.find().limit(2)
      .then(function (members) {
        chai.request(server)
        .post('/gdating/members/' + members[0]._id + '/matches')
        .send({
          _match: members[1]._id
        })
        .end(function(err, res) {
          chai.request(server)
          .delete('/gdating/members/' + members[0]._id + '/matches/' + members[1]._id)
          .end(function (err, res) {
            res.status.should.equal(200);
            res.type.should.equal('application/json');
            res.body.should.be.a('object');
            res.body.should.have.property('data');
            res.body.data.should.be.a('object');
            res.body.data._matches.map(function (match) {
              return match.toString();
            }).should.not.include(members[1]._id.toString());

            done();
          });
        });
      });
    });
  });
});
