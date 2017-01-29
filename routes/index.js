// 'use strict';
// var express = require('express');
// var wikiRouter = require('./wiki');
// var router = express.Router();

// router.use('/wiki', wikiRouter);

// router.get('/', function(req, res, next){
// 	res.render('index');	
// });


// // module.exports = router;

// // //GET /wiki
// // //we don't add a "where" because we just want every page
// router.get('/', function(req, res, next) {
//   //we don't add a "where" because we just want every page. We provide an empty object here
//   //use Page model
//   Page.findAll({})
// //  //once we get all of the pages, we'll handle it this way, when our promise resolves we'll 
// // 	//handle our pages this way
// // 	//error handling middleware
//   	.then(function(pages) {
// 		  res.render('index', {
// 			  //these don't have to match up
// 			  pages: pages
// 		  });
// 	  })
// 	  .catch(next);
// });

// // //user router
// // //wiki route
