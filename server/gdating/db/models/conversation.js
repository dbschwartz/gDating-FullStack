var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var validations = require('./validations');
mongoose.Promise = require('bluebird');

var ConversationSchema = new Schema({
  _members: {
    type: [{
      type: ObjectId,
      ref: 'gdating.members'
    }],
    validate: [
      validations.memberLimit,
      '{PATH} must have two members. Value: {VALUE}'
    ]
  },
  messages: [{
    _sender: {
      type: ObjectId,
      ref: 'gdating.members',
      required: true
    },
    content: {
      type: String,
      minlength: 1,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }]
});

var Conversation = mongoose.model('gdating.conversations', ConversationSchema);

module.exports = Conversation;
