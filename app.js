'use strict';
var express = require('express');
var app = express();
var morgan = require('morgan');
var nunjucks = require('nunjucks');
var bodyParser = require('body-parser')
var makesRouter = require('./routes');
var models = require('./models');
var wikiRouter = require('./routes/wiki');

// app.get('/', function(req, res, next){
//   res.render('index')
// })

var env = nunjucks.configure('views', {noCache: true});
// have res.render work with html files
app.set('view engine', 'html');
// when res.render works with html files, have it use nunjucks to do so
app.engine('html', nunjucks.render);

app.use(morgan('dev'));
app.use('/', makesRouter);
app.use('/wiki', wikiRouter);

// body parsing middleware
app.use(bodyParser.urlencoded({ extended: true })); // for HTML form submits
app.use(bodyParser.json()); // would be for AJAX requests

models.User.sync({})
  .then(function () {
      return models.Page.sync({})
  })
  .then(function () {
      app.listen(3000, function () {
          console.log('Server is listening on port 3000!');
      });
  })
  .catch(console.error);
