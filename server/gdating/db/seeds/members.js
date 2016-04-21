var faker = require('faker');
var Promise = require('bluebird');
var Member = require('../models').Member;

module.exports = seedData;

function seedData (num) {
  var members = [];
  var toGenerate = num || 1000;

  for ( var i = 0; i < toGenerate; i++ ) {
    members.push(constructPerson());
  }

  return Member.collection.insert(members);
};

function constructPerson () {
  var person = faker.helpers.contextualCard();
  delete person.name;

  person.password = faker.internet.password(20);
  person.description = faker.lorem.paragraphs(3);

  person.email = person.email;
  person.username = person.username.toLowerCase() + faker.random.number(10000);
  if ( person.username.length < 6 ) {
    person.username += faker.lorem.word();
  }

  person.active = true;
  person.names = {
    firstName: person.username.split(/[0-9._]/ig)[0] || faker.name.firstName(),
    lastName: person.username.split(/[0-9._]/ig)[1] || faker.name.lastName()
  };

  var slug = (person.username.replace(/[_.]/gi,'-') + '-' +
              faker.finance.mask()).toLowerCase();
  person.slug = faker.helpers.slugify(slug);

  person.gender = faker.random.number(3);

  person.interestedIn = [];
  person.interestedIn.push(faker.random.number(3));
  if ( faker.random.number(100) < 20 ) {
    var num = faker.random.number(3);
    if ( person.interestedIn.indexOf(num) < 0 ) {
      person.interestedIn.push(num);
    }
  }

  return person;
};
