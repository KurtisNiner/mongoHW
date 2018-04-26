var express = require("express");
var handlebars = require("handlebars");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
//scraping tools
var axios = require("axios");
var cheerio = require("cheerio");

// require the models
var db = require("./models");

//set the port 
var PORT = 3000;

// initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Connect to the Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);


//drop the existing database so it clears out for new scrape
//  db.Article.remove({}, function(err){
//   console.log("dropped Articles");
// })
// Routes

// A GET route for scraping the echoJS website
app.get("/scrape", function (req, res) {

  db.Article.remove({}, function (err) {
    console.log("dropped Articles");
  })
  // First, we grab the body of the html with request
  axios.get("https://www.nytimes.com/").then(function (response) {

    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    // grab the h1 elements in the article
    $("article h1").each(function (i, element) {
      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this)
        .children("a")
        .text();
      result.summary = $(this)
        .siblings(".summary")
        .text();
      console.log(result.summary);
      result.link = $(this)
        .children("a")
        .attr("href");

      // this creates an article built from scraping
      db.Article.create(result)
        .then(function (dbArticle) {
          // View the added result in the console
          console.log(dbArticle);

          // If successful in scraping and saving the Artiles, sent this message to the user
          res.send("We have successfully scraped the New York Times");
        })
        .catch(function (err) {
          // If an error occurred, send it to the client
          return res.json(err);
        });
    });



  });
});

// Route for getting all Articles from the db
app.get("/articles", function (req, res) {
  // Grab every document in the Articles collection
  db.Article.find({})
    .then(function (dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// grab a specific article id, and populate the comments entered
app.get("/articles/:id", function (req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.findOne({ _id: req.params.id })
    // populate it with all comments associated
    .populate("comment")
    .then(function (dbArticle) {
      // if we find an article with the same id, show the user
      res.json(dbArticle);
    })
    .catch(function (err) {
      //show json of the error if it occurrs
      res.json(err);
    });
});

// Route for saving/updating an Article's associated comment
app.post("/articles/:id", function (req, res) {
  // Create a new note and pass the req.body to the entry
  db.Comment.create(req.body)

    //then pass the information through dbComment function
    .then(function (dbComment) {

      return db.Article.findOneAndUpdate(
        { _id: req.params.id },
        { comment: dbComment._id },
        { new: true });
    })
    .then(function (dbArticle) {

      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })

    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Start the server
app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});
