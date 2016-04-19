var path = require('path');
var express = require('express');
var router = express.Router();

router.get('/ping', function(req, res, next) {
  res.status(200).send({ message: 'OK' });
});

router.get('/api-docs', function(req, res) {
  res.sendFile(path.join(__dirname + '/../swagger/index.html'));
});

module.exports = router;
