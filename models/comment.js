var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// creating CommentSchema Object
var CommentSchema = new Schema({
  title: String,
  body: String
});

var Comment = mongoose.model("Comment", CommentSchema);

// Export the Comment model
module.exports = Comment;
