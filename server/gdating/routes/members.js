var express = require('express');
var router = express.Router();
var Member = require('../db/models').Member;
var handlers = require('./helpers/handlers');
var Promise = require('bluebird');
var moment = require('moment');

router.get('/ping', handlers.ping);
router.get('/', getAll);
router.get('/search', search);
router.post('/', create);
router.get('/:id', getOne);
router.put('/:id', update);
router.delete('/:id', deleteOne);
router.get('/search/:slug', searchSlug);

// conversations routes
var conversationsRoutes = require('./conversations');
router.use('/:id/conversations', conversationsRoutes);

// matches routes
var matchesRoutes = require('./matches');
router.use('/:id/matches', matchesRoutes);

module.exports = router;

///////////////////////////

function getAll (req, res) {
  var promise = Member.find();

  var limit = parseInt(req.query.limit);
  if ( limit && Number.isInteger(limit) ) { promise = promise.limit(limit); }

  var offset = parseInt(req.query.offset);
  if ( offset && Number.isInteger(offset) ) { promise = promise.skip(offset); }

  promise.exec()
    .then(handlers.success(res))
    .catch(handlers.error(res));
}

function search (req, res) {
  var options = [];
  var exclusive = !!req.query.exclusive;

  if ( req.query.username ) { options.push({ username: req.query.username }); }
  if ( req.query.email ) { options.push({ email: req.query.email }); }
  if ( req.query.gender ) { options.push({ gender: req.query.gender }); }

  if ( req.query.maxAge && req.query.minAge ) {
    var maxDate = moment().subtract(req.query.maxAge, 'years');
    var minDate = moment().subtract(req.query.minAge, 'years');
    options.push({ dob: { $gt: maxDate, $lt: minDate } })
  } else if ( req.query.minAge ) {
    var minDate = moment().subtract(req.query.minAge, 'years');
    options.push({ dob: { $lt: minDate } })
  } else if ( req.query.maxAge ) {
    var maxDate = moment().subtract(req.query.maxAge, 'years');
    options.push({ dob: { $gt: maxDate } })
  }

  if ( req.query.interestedIn ) {
    if ( exclusive ) {
      options.push({ interestedIn: { $all: req.query.interestedIn } });
    } else {
      options.push({ interestedIn: { $in: req.query.interestedIn } });
    }
  }

  var query = ( exclusive ) ? { $and: options } : { $or: options };

  Member.find(query).exec()
    .then(handlers.success(res))
    .catch(handlers.error(res));
}

function getOne (req, res) {
  Member.findOne({ _id: req.params.id }).exec()
    .then(function (result) {
      if ( !result ) { return Promise.reject('No member found with that _id'); }
      else { return Promise.resolve(result); }
    })
    .then(handlers.success(res))
    .catch(handlers.error(res, 404));
}

function create (req, res) {
  Member.create(req.body)
    .then(handlers.success(res, 201))
    .catch(handlers.error(res, 422));
}

function update (req, res) {
  var query = { _id: req.params.id };
  var options = { new: true, runValidators: true, setDefaultsOnInsert: true };

  Member.findOne(query)
    .then(saveMember(req.body))
    .then(handlers.success(res))
    .catch(handlers.error(res, 422));
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

function deleteOne (req, res) {
  var query = { _id: req.params.id };
  var options = { new: true, runValidators: true, setDefaultsOnInsert: true };

  Member.findOneAndUpdate(query, { active: false }, options)
    .then(handlers.success(res))
    .catch(handlers.error(res, 422));
}

function searchSlug(req, res) {
  Member.findOne({slug:req.params.slug})
    .then(handlers.success(res))
    .catch(handlers.error(res))
}
