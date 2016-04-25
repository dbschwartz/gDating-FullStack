process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();

var server = require('../../../app');
var testUtilities = require('../utilities');
var seed = require('../../db/seeds/test');
var Member = require('../../db/models/member');
var moment = require('moment');

chai.use(chaiHttp);

describe('gdating : routes : members', function() {

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

  describe('GET /gdating/members/:id', function() {
    it('should return a single member', function(done) {
      Member.findOne()
      .then(function(member) {
        var memberID = member._id;
        chai.request(server)
        .get('/gdating/members/' + memberID)
        .end(function(err, res) {
          res.status.should.equal(200);
          res.type.should.equal('application/json');
          res.body.should.be.a('object');
          res.body.should.have.property('data');
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('_id');
          res.body.data.should.have.property('email');
          res.body.data.should.have.property('active');
          res.body.data.should.have.property('admin');
          res.body.data.should.have.property('gender');
          done();
        });
      });
    });
  });

  describe('POST /gdating/members', function() {
    it('should create a new member', function(done) {
      chai.request(server)
      .post('/gdating/members')
      .send({
        "username": "michaelherman",
        "names": {
          "firstName": "Michael",
          "lastName": "Herman"
        },
        "description": "Just a short description",
        "email": "michael@herman.com",
        "password": "superstrong",
        "dob": "1960-04-21",
        "phone": "888888888",
        "address": {
          "zipcode": "80302",
          "geo": {
            "lng": 20,
            "lat": 20
          },
          "suite": "10",
          "city": "San Francisco",
          "street": "1010 Market St"
        },
        "website": "https://realpython.com",
        "company": {
          "bs": "awesome python",
          "catchPhrase": "awesome python",
          "name": "Real Python"
        },
        "slug": "2020",
        "gender": 0,
      })
      .end(function(err, res) {
        res.status.should.equal(201);
        res.type.should.equal('application/json');
        res.body.should.be.a('object');
        res.body.should.have.property('data');
        res.body.data.should.be.a('object');
        res.body.data.should.have.property('_id');
        res.body.data.should.have.property('email');
        res.body.data.email.should.equal('michael@herman.com');
        res.body.data.should.have.property('active');
        res.body.data.active.should.equal(true);
        res.body.data.should.have.property('admin');
        res.body.data.admin.should.equal(false);
        res.body.data.should.have.property('gender');
        res.body.data.gender.should.equal(0);
        done();
      });
    });
  });

  describe('PUT /gdating/members/:id', function() {
    it('should update a member\'s first and last name',
      function(done) {
      Member.findOne()
      .then(function(member) {
        var memberID = member._id;
        chai.request(server)
        .put('/gdating/members/' + memberID)
        .send({
          "names": {
            "firstName": "string",
            "lastName": "string"
          }
        })
        .end(function(err, res) {
          res.status.should.equal(200);
          res.type.should.equal('application/json');
          res.body.should.be.a('object');
          res.body.should.have.property('data');
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('names');
          res.body.data.names.should.have.property('firstName');
          res.body.data.names.should.have.property('lastName');
          res.body.data.names.firstName.should.equal('String');
          res.body.data.names.lastName.should.equal('String');
          res.body.data.gender.should.equal(member.gender);
          res.body.data.should.have.property('_id');
          res.body.data.should.have.property('email');
          res.body.data.email.should.equal(member.email);
          res.body.data.should.have.property('active');
          res.body.data.active.should.equal(member.active);
          res.body.data.should.have.property('admin');
          res.body.data.admin.should.equal(member.admin);
          res.body.data.should.have.property('gender');
          res.body.data.gender.should.equal(member.gender);
          done();
        });
      });
    });
  });

  describe('PUT /gdating/members/:id', function() {
    it('should update a member\'s interestedIn', function(done) {
      Member.findOne()
      .then(function(member) {
        var memberID = member._id;
        chai.request(server)
        .put('/gdating/members/' + memberID)
        .send({
          "interestedIn": [
            1, 2
          ]
        })
        .end(function(err, res) {
          res.status.should.equal(200);
          res.type.should.equal('application/json');
          res.body.should.be.a('object');
          res.body.should.have.property('data');
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('interestedIn');
          res.body.data.interestedIn.should.not.equal(
            member.interestedIn);
          res.body.data.interestedIn[0].should.equal(1);
          res.body.data.interestedIn[1].should.equal(2);
          done();
        });
      });
    });
  });

  describe('DELETE /gdating/members/:id', function() {
    it('should delete a member', function(done) {
      Member.findOne()
      .then(function(member) {
        var memberID = member._id;
        chai.request(server)
        .delete('/gdating/members/' + memberID)
        .end(function(err, res) {
          res.status.should.equal(200);
          res.type.should.equal('application/json');
          res.body.should.be.a('object');
          res.body.should.have.property('data');
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('names');
          res.body.data.gender.should.equal(member.gender);
          res.body.data.should.have.property('_id');
          res.body.data.should.have.property('email');
          res.body.data.email.should.equal(member.email);
          res.body.data.should.have.property('active');
          res.body.data.active.should.equal(false);
          res.body.data.should.have.property('admin');
          res.body.data.admin.should.equal(member.admin);
          res.body.data.should.have.property('gender');
          res.body.data.gender.should.equal(member.gender);
          done();
        });
      });
    });
  });

  describe('GET /gdating/members/search', function () {
    ['username', 'email', 'gender'].forEach(function (field) {
      it('should return a member when searched by ' + field, function (done) {
        Member.findOne()
        .then(function (member) {
          chai.request(server)
          .get('/gdating/members/search?' + field + '=' + member[field])
          .end(function (err, res) {
            res.status.should.equal(200);
            res.type.should.equal('application/json');
            res.body.should.be.a('object');
            res.body.should.have.property('data');
            res.body.data.should.be.a('array');
            res.body.data[0].should.have.property('_id');
            res.body.data[0]._id.should.equal(member._id.toString());
            done();
          });
        });
      });
    });

    it('should allow for searching by interestedIn', function (done) {
      Member.findOne()
      .then(function (member) {
        chai.request(server)
        .get('/gdating/members/search?interestedIn[]=' + member.interestedIn[0])
        .end(function (err, res) {
          res.status.should.equal(200);
          res.type.should.equal('application/json');
          res.body.should.be.a('object');
          res.body.should.have.property('data');
          res.body.data.should.be.a('array');
          res.body.data.some(function (returned) {
            return returned._id.toString() === member._id.toString();
          }).should.equal(true);
          done();
        });
      });
    });

    it('should allow a minAge to be set', function (done) {
      Member.findOne()
      .then(function (member) {
        var age = -moment(member.dob).diff(moment(), 'years');
        chai.request(server)
        .get('/gdating/members/search?minAge=' + (age - 1))
        .end(function (err, res) {
          res.status.should.equal(200);
          res.type.should.equal('application/json');
          res.body.should.be.a('object');
          res.body.should.have.property('data');
          res.body.data.should.be.a('array');
          res.body.data.some(function (returned) {
            return returned._id.toString() === member._id.toString();
          }).should.equal(true);
          done();
        });
      });
    });

    it('should allow a maxAge to be set', function (done) {
      Member.findOne()
      .then(function (member) {
        var age = -moment(member.dob).diff(moment(), 'years');
        chai.request(server)
        .get('/gdating/members/search?maxAge=' + (age + 1))
        .end(function (err, res) {
          res.status.should.equal(200);
          res.type.should.equal('application/json');
          res.body.should.be.a('object');
          res.body.should.have.property('data');
          res.body.data.should.be.a('array');
          res.body.data.some(function (returned) {
            return returned._id.toString() === member._id.toString();
          }).should.equal(true);
          done();
        });
      });
    });

    it('should allow for both minAge and maxAge to be set', function (done) {
      Member.findOne()
      .then(function (member) {
        var age = -moment(member.dob).diff(moment(), 'years');
        chai.request(server)
        .get('/gdating/members/search?minAge=' + (age - 1) + '&maxAge=' + (age + 1))
        .end(function (err, res) {
          res.status.should.equal(200);
          res.type.should.equal('application/json');
          res.body.should.be.a('object');
          res.body.should.have.property('data');
          res.body.data.should.be.a('array');
          res.body.data.some(function (returned) {
            return returned._id.toString() === member._id.toString();
          }).should.equal(true);
          done();
        });
      });
    });

    it('should default to an inclusive search', function (done) {
      Member.find().limit(2)
      .then(function (members) {
        var username = members[0].username;
        var email = members[1].email;

        chai.request(server)
        .get('/gdating/members/search?username=' + username + '&email=' + email)
        .end(function (err, res) {
            res.status.should.equal(200);
            res.type.should.equal('application/json');
            res.body.should.be.a('object');
            res.body.should.have.property('data');
            res.body.data.should.be.a('array');
            res.body.data.length.should.equal(2);
            done();
        });
      });
    });

    it('should allow for an exclusive search', function (done) {
      Member.find().limit(2)
      .then(function (members) {
        var username = members[0].username;
        var email = members[1].email;

        chai.request(server)
        .get('/gdating/members/search?exclusive=true&username='
              + username + '&email=' + email)
        .end(function (err, res) {
            res.status.should.equal(200);
            res.type.should.equal('application/json');
            res.body.should.be.a('object');
            res.body.should.have.property('data');
            res.body.data.should.be.a('array');
            res.body.data.length.should.equal(0);
            done();
        });
      });
    });
  });

  describe('GET /gdating/members/seach/:slug', function () {
    it('searches by a user\'s slug name', function (done) {
      Member.findOne()
      .then(function (member) {
        chai.request(server)
        .get('/gdating/members/search/' + member.slug)
        .end(function (err, res) {
            res.status.should.equal(200);
            res.type.should.equal('application/json');
            res.body.should.be.a('object');
            res.body.should.have.property('data');
            res.body.data.should.be.a('object');
            res.body.data.should.have.property('_id');
            res.body.data._id.should.equal(member._id.toString());
            done();
        });
      });
    });
  });
});
