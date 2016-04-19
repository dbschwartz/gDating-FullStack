var path = require('path');
var express = require('express');
var router = express.Router();

router.get('/ping', function(req, res, next) {
  res.status(200).send({ message: 'OK' });
});

router.use('/api-docs', express.static('./api-docs/gdating'));

module.exports = router;
