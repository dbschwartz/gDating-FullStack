var express = require('express');
var router = express.Router();
var Member = require('../db/models').Member;
var handlers = require('./helpers/handlers');

router.get('/ping', handlers.ping);
router.get('/', getAll);
router.post('/', create);
router.get('/:id', getOne);
router.put('/:id', update);
router.delete('/:id', deleteOne);

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
};

function getOne (req, res) {
  Member.findOne({ _id: req.params.id }).exec()
    .then(handlers.success(res))
    .catch(handlers.error(res));
}

function create (req, res) {
  Member.create(req.body)
    .then(handlers.success(res, 201))
    .catch(handlers.error(res, 422));
}

function update (req, res) {
  var query = { _id: req.params.id };
  var options = { new: true, runValidators: true, setDefaultsOnInsert: true }

  Member.findOneAndUpdate(query, req.body, options)
    .then(handlers.success(res))
    .catch(handlers.error(res, 422));
}

function deleteOne (req, res) {
  var query = { _id: req.params.id };
  var options = { new: true, runValidators: true, setDefaultsOnInsert: true }

  Member.findOneAndUpdate(query, { active: false }, options)
    .then(handlers.success(res))
    .catch(handlers.error(res, 422));
}
