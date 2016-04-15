var express = require('express');
var router = express.Router();
var handlers = require('./helpers/handlers');

router.get('/ping', ping);

module.exports = router;

///////////////////////////

function ping (req, res, next) {
  res.status(200).send({ message: 'OK' });
};
