//We are going to build a subrouter, essentially a sub pipeline, composite pipeline that you stick into you main one
// /wiki/
// /wiki/add
// /wiki/somepage
//so that / wiki doesn't have to be repeated
'use strict';

var express = require('express');
var router = express.Router();
module.exports = router;

//attaching some middleware to our router
//retrieve all wiki pages
// GET /wiki
router.get('/', function(req, res, next) {
});

//submit a new page to the database
// POST /wiki
router.post('/', function(req, res, next) {
  //creates a new page for us using the req.body
  //by default req.body is undefined and is populated 
  //when we use body parsing middleware using the body parser
  var newPage = Page.build(req.body);
  //this is asynchronous, and returns a promise 
  //golden rule: anytime anything in sequelize interacts 
  //with the db like save or sync or a query it is going to go into the database
  //if this goes wrong I want to catch the error that is being thrown at me
  //before this instance gets validated, we want to take the title attached to that instance
  //and set a URL title on that instance based on that title
  newPage.save()
    .then(function(savedPage) {
      console.log("Page was saved successfully!")
      //when a plage is successful we want to res.redirect to /wiki/
      //redirect to our list of pages
      res.redirect(savedPage.route);
    })
    .catch(function(err) {
      //when you call next with an error, it sends our error down the pipeline to our nearest error handling middleware
      next(err);
    });
});
// GET /wiki/add
router.get('/add', function(req, res) {
  res.render('addpage');
});

//GET /wiki/Javascript (example)
// /wiki/add must be above this piece of middleware in order for this to work
router.get('/:urlTitle', function(req, res, next) {
  var urlTitleOfPage = req.params.urlTitle;
  //running a query on page
  Page.findOne({
	  where: {
		  urlTitle: urlTitleOfPage
	  }
  })
    .then(function(page) {
		if(page === null) {
			return next(new Error('That page was not found!'));
		}
		//use our view engine
		res.render('wikipage', {
			//to the template this thing called page is gonna be page
			page: page
		});
	})
	//send the error we get here down to the error handling middleware in our pipeline
	// .catch(next);
	.catch(function() {
		next(err);
	});
});

var models = require('../models');
var Page = models.Page;
var User = models.User;



//   // make sure we only redirect *after* our save is complete!
//   // note: `.save` returns a promise or it can take a callback.
//   page.save()
//       // .then(page => res.json(page))
//       .then(function(savedPage){
//           res.redirect(savedPage.route); // route virtual FTW
//         })
//       .catch(next);

// });

