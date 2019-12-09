

$(document).ready(function () {

    $("select").formSelect();

    $('.parallax').parallax();
});


//_____________________________________________
//      Add materialize code above this line
//____________________________________________

//------------------------------------------------
//google API

var searchCriteria = "Thor";
var queryGoogleBooks = "https://www.googleapis.com/books/v1/volumes?q=" + searchCriteria;

$.ajax({
    url: queryGoogleBooks,
    method: "GET"
}).then(function (respGoogleBooks) {
    console.log(respGoogleBooks);


});

// paul was here as well
//-----------------------------------
//The Movie DB

// var movieDBKey = "a5b6a31636acf8a8c3c75e4575e245dd";
// var queryMovieDB = "https://api.themoviedb.org/3/search/movie?api_key=" + movieDBKey + "&query=" + booktitle;

// $.ajax({
//     url: queryMovieDB,
//     method: "GET"
// }).then(function (respMovieDB) {
//     console.log(respMovieDB);

// })

//-------------------------------------

// click event for the user search button 
// $(".container").on("keyup", function (event) {
//     event.preventDefault();
//     console.log(event);
    // if event.key === "enter"
    // var userSearch = $("#userSearch").val()
    // 

// if ( e.keycode === 13) {



var queryRawg = "https://api.rawg.io/api/games?search=" + searchCriteria;

//code for the ajax query call to the Rawg api
$.ajax({
    url: queryRawg,
    method: "GET"
}).then(function (respRawg) {
    console.log(respRawg);

    //variable that is created in order to limit the number of columns placed into generated row div as 4
    var countRowDiv = 0;
    var rowDiv1 = $("<div>").attr("class", "row");

    //each function that runs for every index of the resp object returned by the ajax call to Rawg api
    $.each(respRawg.results, function (index) {

        //this if statement declares that the code will only run while count variable is less than 4.  
        if (countRowDiv < 4) {
           
            var colDiv1 = $("<div>").attr("class", "col s3");
            var genreList = $("<ul>").text("genres: ");
            
            //this line of code calls function that grabs the name & image from Rawg Api and generates it into div parameters
            genTitleImgFromQuery(rowDiv1, colDiv1, respRawg.results[index].name, respRawg.results[index].background_image);
            //this line of code calls function that grabs genre object from Rawg Api and generates them into a list and writes it to div parameters
            genGenreList(rowDiv1, colDiv1, genreList, respRawg.results[index]);
          
            countRowDiv++;
          
        } else {
            
            //this code appends the rowDiv1 variable filled with the four cols append in above code to the page into the div with gameContent id 
            $("#gameContent").append(rowDiv1);
            //This line of code clears the rowDiv1 variable and sets it to an empty div with class row.
            rowDiv1 = $("<div>").attr("class", "row");
            //sets the count variable to 0 so that it we can go back up to the above if statement code and start generating cols in rows again
            countRowDiv = 0;
        }

    });

});

// });

// $(".movie-input").on("click", function(event) {

    // event.preventDefault();


    var movie = "Titanic";

    var queryURL = "https://www.omdbapi.com/?t=" + movie + "&apikey=trilogy";
    
    //AJAX call
    $.ajax({
        url: queryURL,
        method: "GET"
      }).then(function(response) {
        var movieMain = $("<div>");
        movieMain.addClass("movie");

        //rating
        
        var rating = response.Rated;
        var pRating = $("<p>");
        pRating.text("Rating: " + rating);
        movieMain.append(pRating);

        //release
        var dateRelease = response.Released;
          var pRelease = $("<p>");
          pRelease.text("Released: " + dateRelease);
          movieMain.append(pRelease);

         //plot 
          var plot = response.Plot;
          var pPlot = $("<p>");
          pPlot.text("Plot: " + plot);
          movieMain.append(pPlot);

         //poster 
          
          var imgUrl = response.Poster;
          var image = $("<img>").attr("src", imgUrl);
          movieMain.append(image);
        
          $("#movieContent").append(movieMain);

        });

        function successCallback(data) {
            'use strict';
            $('#results').text('');
            data = JSON.parse(data);
        }

// })



    //                      Functions below this line
    //___________________________________________________________________________________

    //This function grabs the game name and image from the Rawg Api and appends it into a column div and then appends that column into the mainDiv parameter
    function genTitleImgFromQuery(mainDiv, column, name, img) {

        //line of code grabs the gamecontent col div, creates a h1 tag in it, and then adds the title of the game from ajax resp object into it
        mainDiv.append(column.append($("<h3>").attr("class", "flow-text").text("Name:" + name)));
        //line of code that creates creates the img tag, adds the image to it, and places it into the proper div
        mainDiv.append(column.append($("<img>").attr({ "class": "responsive-img", "src": img, "alt": "Game Image" })));

    }

    //This function grabs the genre object from the Rawg Api and places the info into a list which is appended into a column.  That column is then appened to the mainDiv parameter
    function genGenreList(mainDiv, column, genreList, respObject) {

        //function that runs for every index of the genre array to grab the name and place it into an li item.
        $.each(respObject.genres, function (index) {

            genreList.append($("<li>").text(respObject.genres[index].name))
            mainDiv.append(column.append(genreList));

        });

    }
