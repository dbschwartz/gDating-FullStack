process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../../../app');
var should = chai.should();


chai.use(chaiHttp);


describe('index routes', function() {

  describe('/GET ping', function() {
    it('should return a response', function(done) {
      chai.request(server)
      .get('/gdating/ping')
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