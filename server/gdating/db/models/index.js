var mongoose = require('mongoose');
var db_url = process.env.MONGODB_URI || 'mongodb://localhost/gdating-db';
mongoose.connect(db_url);

module.exports.Member = require('./member');
module.exports.Conversation = require('./conversation');
