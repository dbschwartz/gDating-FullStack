var Promise = require('bluebird');
var express = require('express');
var router = express.Router({ mergeParams: true });
var db = require('../db/models');
var handlers = require('./helpers/handlers');

router.get('/ping', handlers.ping);
router.get('/', getAll);
router.post('/', createOrUpdate);
router.get('/:recipientId', getOne);

module.exports = router;

///////////////////////////

function getAll (req, res) {
  db.Conversation.find({
    _members: {
      $in: [{ _id: req.params.id }]
    }
  })
  .then(handlers.success(res))
  .catch(handlers.error(res));
};

function createOrUpdate (req, res) {
  if ( !req.body.content ) {
    var err = 'To update or create a new message, a `content` key is required.';
    return handlers.error(res)(err);
  }

  var members = constructMembers(req.params.id, req.body);
  Promise.all(members)
    .then(handlers.conversation.validation)
    .then(upsert)
    .then(handlers.success(res, 201))
    .catch(handlers.error(res, 422));
};

function getOne (req, res) {
  db.Conversation.find({
    _members: {
      $all: [{ _id: req.params.id }, { _id: req.params.recipientId }]
    }
  })
  .then(handlers.success(res))
  .catch(handlers.error(res));
};

function upsert (msg) {
  return db.Conversation.findOne({
    _members: { $all: [ { _id: msg.sender }, { _id: msg.recipient } ]}
  }).then(function (result) {
    return result ? update(result, msg) : create(msg);
  });
};

function create (msg) {
  return db.Conversation.create({
    _members: [{ _id: msg.sender }, { _id: msg.recipient }],
    messages: [{ _sender: msg.sender, content: msg.content }]
  });
};

function update (result, msg) {
  var query = { _id: result._id };
  var data = { $push:
    { messages: { _sender: msg.sender, content: msg.content } }
  };
  var options = { new: true };
  return db.Conversation.findOneAndUpdate(query, data, options);
};

function validateMember (id) {
  return db.Member.findOne({ _id: id }).select('_id').exec();
};

function constructMembers (id, body) {
  return [
    validateMember(id),
    validateMember(body._recipient),
    Promise.resolve({
      sender: id,
      recipient: body._recipient,
      content: body.content
    })
  ];
};
