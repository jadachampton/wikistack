'use strict';
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.redirect('/');
});

router.post('/', function(req, res, next) {
  res.send('got to POST /wiki/');
});

router.get('/add', function(req, res, next) {
  res.render('addpage');
});

router.post('/add', function(req, res, next) {
  res.json(req.body);
});

module.exports = router;
