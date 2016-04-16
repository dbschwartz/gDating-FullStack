var faker = require('faker');
var mongoose = require('mongoose');
require('mongoose-setter')(mongoose);
var Schema   = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');
var validations = require('./validations');
var ObjectId = Schema.Types.ObjectId;
mongoose.Promise = require('bluebird');

var MemberSchema = new Schema({
  active: { type: Boolean, default: true },
  username: {
    type: String,
    required: true,
    minlength: 6,
    lowercase: true,
    unique: true,
    trim: true
  },
  names: {
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      trim: true
    }
  },
  avatar: { type: String, default: faker.image.avatar() },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    unique: true,
    required: true,
    validate: [
      validations.validEmail,
      '{PATH} must be a valid email. Value: `{VALUE}`'
    ]
  },
  password: {
    type: String,
    minlength: 8,
    required: true
  },
  dob: {
    type: Date,
    required: true,
    validate: [
      validations.ageLimit(18),
      '{PATH} value is too low. Must be older than 18 years old. Value: `{VALUE}`'
    ]
  },
  phone: { type: String },
  address: {
    street: { type: String },
    suite: { type: String },
    city: { type: String },
    zipcode: { type: String },
    geo: {
      lat: {
        type: Number,
        required: true
      },
      lng: {
        type: Number,
        required: true
      }
    }
  },
  website: String,
  company: {
    name: String,
    catchPhrase: String,
    bs: String
  },
  slug: {
    type: String,
    lowercase: true,
    required: true,
    unique: true
  },
  gender: {
    type: Number,
    min: 0,
    max: 3,
    default: 0
  },
  interestedIn: {
    type: [{
      type: Number,
      min: 0,
      max: 3
    }],
    required: true,
    default: [ 0, 1, 2, 3 ],
    validate: [
      validations.uniqueVals,
      'Error, {PATH} must be unique values. Value: `{VALUE}`'
    ]
  },
  _matches: [{
    type: ObjectId,
    ref: 'members'
  }]
});

MemberSchema.path('names.firstName').trim().capitalize();
MemberSchema.path('names.lastName').trim().capitalize();
MemberSchema.plugin(uniqueValidator);

var Member = mongoose.model('members', MemberSchema);
module.exports = Member;
