'use strict';
var express = require('express');
var morgan = require('morgan');
var nunjucks = require('nunjucks'); // swig does the same thing as nunjucks
var bodyParser = require('body-parser')
var makesRouter = require('./routes');

var models = require('./models');
var Page = models.Page;
var User = models.User;


//invoke express library gives us back an app which is like a pipeline
var app = express();
var wikiRouter = require('./routes/wiki');

// when res.render works with html files, have it use nunjucks to do so
//we are setting up the view engine and naming it 'html' because of the 
//extension of the files that we want are files to be in so that we don't
//have to provide the file extension of the view that we are working in 
//over and over. This engine is going to be powered by a function 'nunjucks.render'
app.engine('html', nunjucks.render);
//configure nunjucks to 'noCache: true', so that everytime nunjucks reads a file 
//from the file system, if it is told to go ahead and read that file again in the 
//future, it will use the output from a previous read in order to work faster so that
//it has to touch the filesystem less, which is good for a deployed application
//but in development, we may run into false negatives when we may have changed a file
//and our server doesn't restart and nunjucks has already read that file at that 
//location and uses the previous output so our changed isn't reflected
//don't remember any previous fileread, always read from the filesystem
var env = nunjucks.configure('views', {noCache: true});
// have res.render work with html files
// we want to tell the express application that the view engine that we will be using is html
app.set('view engine', 'html');
//this directory where our index.js is/views is all in order to power the whole res render thing
//look in the views folder of 
// app.set('views', __dirname + '/views'); ==> not necesary when using ninjucks, we are already 
//pointing nunjucks to the views folder with 'nunjucks.configure'


//================================================================================================
//every request that we make to the server we want to pass through our morgan logging middleware
app.use(morgan('dev'));

//if this request that I get is a post or put request, it might have a body,
//so, setup a body parser in order to parse those bodies
//extended: false option is something that we need if we use urlencoded otherwise body parser will yell at you
//body parsing middleware
app.use(bodyParser.urlencoded({ extended: true })); // for HTML form submits
app.use(bodyParser.json()); // would be for AJAX requests


//setup static routing incase we want to get: a frontend library, or something from our node_modules folder, or stylesheets
//makes anything in the nodemodules folder able to be accessed by the url
//not a good idea when it comes to web security "these are the libraries in the code base of libraries that my server is using"
app.use(express.static(__dirname + '/node_modules'))
app.use(express.static(__dirname + '/public'));
//================================================================================================


//we put this here because we want to make sure that our request goes to the above part
//of the pipeline first
//plug wikiRouter into our main pipeline
//anything that starts with /wiki in this URL we are going to take that request and pipe it into the subrouter
//the subrouter is any way that it's configured is it's without the /wiki
app.use('/wiki', wikiRouter);

//this is telling our express application to go render our index.html
app.get('/', function(req, res){
  res.render('index')
});
//***ERROR HANDLING MIDDLEWARE***
//express knows that it's error handling middleware if it is provided with 4 arguments
//as opposed to our normal middleware like our get
//this error here is going to be what next was called with
app.use(function(err, req, res, next) {
	console.error(err);
	res.status(500).send(err.message);
});
//sync Page and User model and once those are good to go, let's start our sever
//Any time we are interacting with our db itself it's trying to sync this user model
//returns a promise
//if it deosn't exist it will create a user table
//if it does exist then make sure that it matches the columns that were given in the schema in this model
User.sync()
//when that goes well, our .then success function will be called
	.then(function() {
    //now that user synced let's go ahead and page sync for our page model
    //we are returning it because we are in a .then chain and we want our next .then to work 
    	return Page.sync();
	})
  //this .then will wait until the previous .then has completed
  	.then(function() {
	  app.listen(3000, function () {
		console.log('Server is listening on port 3000!');
	});
  });
//now that we have synced our user table and our page table, everything is good and we can go ahead and say
//server listen, turn on

