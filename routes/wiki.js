'use strict';
var express = require('express');
var router = express.Router();
var models = require('../models');
var Page = models.Page;
var User = models.User;


router.get('/', function(req, res, next) {
  res.redirect('/');
});

router.post('/', function(req, res, next) {
  var page = Page.build({
    title: req.body.title,
    content: req.body.content
  });

  // make sure we only redirect *after* our save is complete!
  // note: `.save` returns a promise or it can take a callback.
  page.save()
      // .then(page => res.json(page))
      .then(function(savedPage){
          res.redirect(savedPage.route); // route virtual FTW
        })
      .catch(next);

});


router.get('/:urlTitle', function (req, res, next) {
  Page.findOne({
    where: {
      urlTitle: req.params.urlTitle
    }
  })
  .then(function(page){
    res.render('wikipage', { page } );
  })
  .catch(next);
});

router.get('/add', function(req, res, next) {
  res.render('addpage');
});


module.exports = router;
