// Require mongoose
var mongoose = require("mongoose");
// Create Schema class
var Schema = mongoose.Schema;

// Schema
var ArticleSchema = new Schema({
  
  title: {
    type: String,
    required: true,
    unique: true
  },
  
  link: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
   author: {
    type: String
  },
  
  comments: [ {
    type: Schema.Types.ObjectId,
    ref: "Comment"
  }]
});


var Article = mongoose.model("Article", ArticleSchema);


module.exports = Article;
