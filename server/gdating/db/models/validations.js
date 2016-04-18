var moment = require('moment');

module.exports = {
  validEmail: validEmail,
  uniqueVals: uniqueVals,
  ageLimit: ageLimit,
  memberLimit: memberLimit
};

function validEmail (val) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(val);
};

function uniqueVals (values) {
  var uniqued = values.reduce(function (acc, val) {
    if ( acc.indexOf(val) < 0 ) { acc.push(val); }
    return acc;
  }, []);

  return uniqued.length === values.length;
};

function ageLimit (limit) {
  return function (val) {
    return moment().subtract(limit, 'years') > moment(val);
  }
};

function memberLimit (val) {
  return val.length === 2;
};
