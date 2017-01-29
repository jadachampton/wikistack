//
var Sequelize = require('sequelize');
//create database connection, local host 5432 which is where our databse is running/the db name running on that process
//we will be using this db in order to define our models and what they should be
var db = new Sequelize('postgres://localhost:5432/wikistack', {
    logging: true
});


//our Page model (convention for naming models - capitalized)
//define(modelName, attributes, [options]) -> Model
//attributes/schema object
//1st arg of db.define is page; 2nd argument defines the schema
//optional 3rd argument: hooks, virtuals, instance methods, class methods
var Page = db.define('page', {
  title: {
    //STRING is a method ==> equelize.STRING(1500), only allow an input of up to 1500 characters
    //default is STRING(255)
    type: Sequelize.STRING,
    //validation: title is required
    allowNull: false
  },
  urlTitle: {
    type: Sequelize.STRING,
    allowNull: false
  },
  //Sequelize.TEXT is similar to Sequlize.STRING, but with no size constraint
  content: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  //Sequelize.ENUM ==> enumerated values, this satus field can only be one of these two values 'open' or 'closed
  status: {
    type: Sequelize.ENUM('open', 'closed')
  },
},  {
  //anytime something happens to an instance, these functions are gonna trigger based on that event happening
  //hook is a lifecycle method
  //hooks property is = to this object as a value
  hooks: {
    //this is gonna trigger right before we try to validate this instance
    //we receive the instance itself as a parameter of the hook
    beforeValidate: function(page) {
      if(page.title){
        page.urlTitle = page.title.replace(/\s+/g, '_').replace(/\W/g, '');
      }
      console.log(page.urlTitle);
    }
  },
  //works like hooks, in that we say here are our getter methods and we need to name them
  //this function is gonna run int he contetext of the specific instance that we are accessing this property off of
  //we don't call virtuals we jsut aceess them like regual properties
  //getterProperties call functions in teh background to go and get some value
  //powered by objects define property in javascript
  //we aren't calling anything
  //route is not in our database, it's derived when we use the virtual
 getterMethods: {
    route: function() {
      return '/wiki/' + this.urlTitle;
    }
  }
});

var User = db.define('user', {

});

//make models acceptable to the rest of program
//nodes export module system
module.exports = {
  Page: Page,
  User: User
};

//a virtual is when you want to have a property on your instance
//for example: a specific page or a specific user where we want to be able to say
//lets go get that value off of the page but it's alwasy derived from other information on the page
//like maybe the title or the status but in this case it's going to be the url Title
//because it's always derived from another field on the record, we don't need to store it
//We are gonne build a virtual, we will build a getter method on our schema which will allow use to 
//get wiki/url title by just saying .route off of our page