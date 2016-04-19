var express = require('express');
var router = express.Router({ mergeParams: true });
var Member = require('../db/models').Member;
var handlers = require('./helpers/handlers');

router.get('/ping', handlers.ping);
router.get('/', getMatches);
router.post('/', create);
router.delete('/:matchId', deleteMatch);

///////////////////////////

function getMatches (req, res) {
  return Member.find({
    _matches: { $in: [{ _id: req.params.id }] }
  }).select('_id').exec()
  .then(handlers.success(res))
  .catch(handlers.error(res));
};

function create (req, res) {
  if ( !req.body._match ) {
    var err = 'To create a new match, a `_match` key is required with a member id.';
    return handlers.error(res)(err);
  }

  var query = { _id: req.params.id };
  var options = { new: true, runValidators: true, setDefaultsOnInsert: true };

  return Member.findOneAndUpdate(query, {
    $addToSet: { _matches: { _id: req.body._match } }
  }, options)
  .then(handlers.success(res, 201))
  .catch(handlers.error(res, 422));
}

function deleteMatch (req, res) {
  var query = { _id: req.params.id };
  var options = { new: true };

  return Member.findOneAndUpdate(query, {
    $pull: { _matches: req.params.matchId }
  }, options).exec()
  .then(handlers.success(res, 200))
  .catch(handlers.error(res, 404));
}

module.exports = router;
