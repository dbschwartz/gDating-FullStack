var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/gdating-db');

module.exports.Member = require('./member');
module.exports.Conversation = require('./conversation');
