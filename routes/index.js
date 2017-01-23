'use strict';
var express = require('express');
var wikiRouter = require('./wiki');
var router = express.Router();

router.use('/wiki', wikiRouter);

router.get('/', function(req, res, next){
  res.render('index');
})

module.exports = router;
