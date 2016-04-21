var faker = require('faker');
var bcrypt = require('bcryptjs');
var mongoose = require('mongoose');
require('mongoose-setter')(mongoose);
var Schema   = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');
var validations = require('./validations');
var ObjectId = Schema.Types.ObjectId;
mongoose.Promise = require('bluebird');

var MemberSchema = new Schema({
  active: { type: Boolean, default: true },
  admin: { type: Boolean, default: false },
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
  description: String,
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
    default: [ 0, 1, 2, 3 ],
    validate: [
      validations.uniqueVals,
      'Error, {PATH} must be unique values. Value: `{VALUE}`'
    ]
  },
  _matches: [{
    type: ObjectId,
    ref: 'gdating.members'
  }]
});

MemberSchema.path('names.firstName').trim().capitalize();
MemberSchema.path('names.lastName').trim().capitalize();
MemberSchema.plugin(uniqueValidator);

// hash the password before it saving to the db
MemberSchema.pre('save', function(next) {
  var user = this;
  // only hash if password is new or being modified
  if(!user.isModified('password')) {
    return next();
  }
  // generate salt
  bcrypt.genSalt(10, function(err, salt) {
    if(err) {
      return next(err);
    }
    // hash password
    bcrypt.hash(user.password, salt, function(err, hash) {
      if(err) {
        return next(err);
      }
      // override the plain-text password with new hashed/salted password
      user.password = hash;
      // go to the next middleware function
      next();
    });
  });
});

// compare password to verify plain text against the hashed password
MemberSchema.methods.comparePassword = function(password, done)  {
  bcrypt.compare(password, this.password, function(err, match) {
    if(err) {
      return done(err);
    }
    done(err, match);
  });
};

var Member = mongoose.model('gdating.members', MemberSchema);
module.exports = Member;
