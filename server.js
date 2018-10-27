
// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
const EXPHBS = require("express-handlebars");

// Requiring models
var Comment = require("./models/Comment.js");
var Article = require("./models/Article.js");

// Set mongoose 
mongoose.Promise = Promise;

const PORT = process.env.PORT || 3000;

// Express
const APP = express();

// Use body parser
APP.use(bodyParser.urlencoded({extended: false}));

// Static dir
APP.use(express.static("public"));

// Handlebars
APP.engine("handlebars", EXPHBS({ defaultLayout: "main" }));
APP.set("view engine", "handlebars");

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);

// Database configuration 

// Routes

require("./controllers/routes.js")(APP);

// Listen on port 3000
APP.listen(PORT, function() {
  console.log("App running on port", PORT);
});

