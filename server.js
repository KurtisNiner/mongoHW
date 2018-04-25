//require all the npm's 
// var request = require("request");
// var express = require("express");
// var axios = require("axios");
// var cherrio = require("cheerio");
// var handlebars = require("express-handlebars");
// var bodyParser = require("body-parser");
// var mongoose = require("mongoose");
// var logger = require("morgan")
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");

// reqire the models 
var db = require("./models");
var PORT = 3000;

// Initialize Express
var app = express();

// morgan tool for logging 
app.use(logger("dev"));

// body-parcer for the submission of forms 
app.use(bodyParser.urlencoded({ extended: true }));

// express.static to serve the public folder as a static directory
app.use(express.static("public"));

// this connects program to mongoDB and works through Heroku
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

// this is just for the regular localhost
// mongoose.connect("mongodb://localhost/mongoHeadline");


//making the routes here 

// GET route to scrape yahoo news website
app.get("/scrape", function(req, res) {

  //grab all html in the file
  axios.get("https://www.yahoo.com/news/").then(function(response) {
    
//load/save the response object that we get from the website to cheerio using var of $
    var $ = cheerio.load(response.data);

    // grab everything in the list tag and js-streat-content class
    $("li js-stream-content").each(function(i, element) {
      
      // Save what we get into a result object 
      var result = {};

      //console.log the result that we get 
      console.log(result);

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this)
        .children("a")
        .text();
        console.log(result.title);
      result.link = $(this)
        .children("a")
        .attr("href");
        console.log(result.link);

    //creating a new Article from the result object that we made from scraping the yahoo website
      db.Article.create(result)

        .then(function(dbArticle) {

          console.log(dbArticle);
        })
        .catch(function(err) {

          // if an error, show the user
          return res.json(err);
        });
    });

//sent the scrape complete message to the html if scrape is complete
    res.send("you have successfully scrapped the Yahoo Website");

  });
});

//this route finds all the Articles in the database
app.get("/articles", function(req, res) {

  //finds all articles
  db.Article.find({})
    //send the result to the client to view in the html

  .then(function(dbArticle) {
    res.json(dbArticle);
  })

  //iff an error occurs, show the user 
  .catch(function(err) {
    res.json(err);
  });
});



// Start server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
