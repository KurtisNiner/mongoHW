///this file is a test server 



var request = require("request");
var express = require("express");
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
// Routes

var url = "https://www.nytimes.com/?WT.z_jog=1&hF=f&vS=undefined";

request(url, function(err, resp, body){
    var $ = cheerio.load(body);

    var titleHeading = $(".story-heading h1");
    var titleHeadingText = titleHeading.text();

    var summary = $(".summary p");
    var summaryText = summary.text();

    var link = $(".summary p");
    var linkText = link.text();

    var newsArticle = {
        titleHeading: titleHeadingText,
        summary: summaryText,
        link: linkText
    }
    console.log(newsArticle);
})