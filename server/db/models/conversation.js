var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
mongoose.Promise = require('bluebird');

var ConversationSchema = new Schema({
  _members: {
    type: [{
      type: ObjectId,
      ref: 'members'
    }],
    validate: [ memberLimit, '{PATH} must have two members. Value: {VALUE}' ]
  },
  messages: [{
    _sender: {
      type: ObjectId,
      ref: 'members',
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

var Conversation = mongoose.model('conversations', ConversationSchema);

module.exports = Conversation;

//////////////////

function memberLimit (val) {
  return val.length === 2;
};
