var mongoose = require('mongoose');
var config = require('../../_config');
var environment = process.env.NODE_ENV || 'development';
var mongoURI = config.mongoURI[environment];

mongoose.connect(mongoURI);

module.exports.Member = require('./member');
module.exports.Conversation = require('./conversation');
