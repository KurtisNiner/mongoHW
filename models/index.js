//export the articles and comments js file because browser defaults 
//to the index.js file
module.exports = {
    Article: require("./article"),
    Comment: require("./comment")
  };
  