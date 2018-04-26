// Grab the articles as a json
$.getJSON("/articles", function (data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#articles").append("<p data-id='" + 
                    data[i]._id + "'>" + 
                    data[i].title + "<br />" + 
                    data[i].summary + "<br />"+ 
                    data[i].link + "</p>");    
                    // createHTML();
  }
});


// Whenever someone clicks a p tag
$(document).on("click", "p", function () {

  // Empty the notes from the note section
  $("#comments").empty();

  // this saves the id from the p tag
  var thisId = $(this).attr("data-id");

  // AJAX call to the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function (data) {

      console.log(data);
      // The title of the article
      $("#comments").append("<p>" + data.title + "</p>");

      // A textarea to add a new comment body
      $("#comments").append("<input id='userCommentsBody' name='commentBodyOutput'></input>");

      // A button to submit a new comment, with the id of the article saved to it
      $("#comments").append("<button data-id='" + data._id + "' id='saveComment'>Save This Comment</button>");

      // If there's a comment in the article
      if (data.comment) {

        // output the comment body in html
        $("#userCommentsBody").val(data.comment.commentBodyOutput);
      }
    });
});

// When you click the savecomment button
$(document).on("click", "#saveComment", function () {

  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
   
      // Value taken from note textarea
      body: $("#userCommentsBody").val()
    }
  })
    // With that done
    .then(function (data) {
      // Log the response 
      // console.log(data);
      // Empty the comments section
      $("#comments").val("");
    });

  // removed the values entered 
  $("#userCommentsBody").val("");
});

  //attempt handlebars
  // function createHTML(newsData){
  //   var rawTemplate = document.getElementById("#newsTemplate").innerHTML;
  //   var compileTemplate = Handlebars.compile(rawTemplate);
  //   var ourGeneratedHTML = compiledTemplate(newsData);

  //   var petsContainer = document.getElementById("#articles");
  //   petsContainer.innerHTML = ourGeneratedHTML;

  // }