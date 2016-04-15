var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/gdating-db');

module.exports.Member = require('./member');
