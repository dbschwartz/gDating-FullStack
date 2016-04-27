var express = require('express');
var router = express.Router();
var Promise = require('bluebird');

var Member = require('../db/models').Member;
var handlers = require('./helpers/handlers');
var authHelpers = require('./helpers/auth');


router.post('/register', function(req, res, next) {
  // ensure user does not already exist
  Member.create(req.body)
    .then(function (member) {
      var token = authHelpers.generateToken(member);
      return Promise.resolve({
        token: token,
        data: member
      });
    })
    .then(handlers.success(res, 201))
    .catch(handlers.error(res, 422));
});

router.post('/login', function (req, res, next) {
  // ensure that user exists
  Member.findOne({email: req.body.email})
  .then(function (user) {
    if (!user) {
      return res.status(401).json({
        status: 'fail',
        message: 'Email does not exist',
        requestBody: req.body
      });
    } else
      if ( !req.body.password ) {
        return res.status(401),json({
          status: 'fail',
          message: 'Missing password.',
          requestBody: req.body
        });
      }
      user.comparePassword(req.body.password, function (err, match) {
        if (err) {
          return next(err);
        }
        if (!match) {
          return res.status(401).json({
            status: 'fail',
            message: 'Password is not correct',
            requestBody: req.body
          });
        }
      user = user.toObject();
      delete user.password;
      var token = authHelpers.generateToken(user);
      res.status(200).json({
        status: 'success',
        data: {
          token: token,
          user: user
        }
      });
    });
  })
  .catch(function (err) {
    return next(err);
  });
});


module.exports = router;
