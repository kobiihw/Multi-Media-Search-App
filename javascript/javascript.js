var userSearchObject = [];


$(document).ready(function () {

    //This is the initialization of page function.  It has some jquery essential for materialize CSS in it. 
    //Also contains code for rendering search buttons from localStorage object
    init();

    //______________________________________________________
    //_______Add Materialize Code above this lie____________
    //______(Materialize Code added to init function)________

    //this code below keeps more than one collapsible div open at a time
    var elem = document.querySelector('.collapsible.expandable');
    var instance = M.Collapsible.init(elem, {
        accordion: false
    });

    var googleBooksApiKey = "AIzaSyCV2NuETPfhp3RfGB5gwxvt7qbXW8EMPfQ";
    var OMDBApiKey = "trilogy";
    var fullContainer = $("#fullPageContainer");
    var mainModalDiv = $("<div>").attr({ "id": "mainModalDiv", "class": "row" });


    fullContainer.append(mainModalDiv);

    //click event on the entire container of the page
    fullContainer.on("click", function (event) {

        //These are variables that exist within the click event and are used in API search function which is a series of if statements checking for the search criteria of the user.  
        //Then based on criteria it runs the proper function to perform the proper search in the right API. 
        var dropDownValue = $(".select-dropdown").val();
        var userSearchValue = $("#userSearch").val();
        var bookCheckedBool = $("#book-op")[0].checked;
        var movieCheckedBool = $("#movie-op")[0].checked;
        var gameCheckedBool = $("#game-op")[0].checked;

        //the below if statement is looking for a click on the submit buttom and if the dropdown menu option "Keyword is selected" 
        if (event.target.id === "userSearchButton") {

            // event.preventDefault();

            //This function checks the users designated search criteria
            userAPISearch(userSearchValue, dropDownValue, bookCheckedBool, movieCheckedBool, gameCheckedBool);
            saveUserInput(userSearchValue, dropDownValue, bookCheckedBool, movieCheckedBool, gameCheckedBool);

        };

        //the below if statement is looking for a click on the class userSearchListButton.  Essentially looking for the buttons user search list
        if (event.target.className.includes("userSearchListButton") === true) {
            //This variable grabs the userSearch button text and splits its contents into an array of three elements
            var keynameValue = event.target.innerHTML.split(":", 3);

            //this code runs a function for each index of userSearch Object.  It is looking for the searchText key value that matches the keynameValue variable.
            //When it finds that key: value pair it uses the content in the object to run a user API search  
            $.each(userSearchObject, function (index) {
                //if statement checking for userSearchObjects key:value pairs that match the keynameValue variables based on the keyname variable array elements.  If it mat
                if (userSearchObject[index].searchText == keynameValue[0] && userSearchObject[index].DropDownChoice == keynameValue[1].trim() && keynameValue[2].includes("book") === userSearchObject[index].books && keynameValue[2].includes("movie") === userSearchObject[index].movies && keynameValue[2].includes("game") === userSearchObject[index].games) {

                    //calls the userAPI search function
                    userAPISearch(userSearchObject[index].searchText, userSearchObject[index].DropDownChoice, userSearchObject[index].books, userSearchObject[index].movies, userSearchObject[index].games);

                };
            });
        };
        //this if statment checks the click event for the close "X" button
        if (event.target.textContent === "X") {

            var keynameSearchListButton = event.target.parentElement.children[0].innerHTML.split(":", 1)

            //This code runs a function for each index of userSearchObject.  It is looking for the searchText key value that matches the keynameSearchListButton variable.
            $.each(userSearchObject, function (index) {

                if (userSearchObject[index].searchText == keynameSearchListButton) {
                    //removes the element associated with searchTExt that matches the keynameSearchListButton variable
                    userSearchObject.splice(index, 1);
                    //Removes the li div that is associated with the "X" button from the search button list
                    event.toElement.closest("li").remove();
                    //takes the searchedCityNames that has had the city removed from it and sets it to local storage
                    localStorage.setItem("userSearchObject", JSON.stringify(userSearchObject));
                }
            });
        }
    });


    //___________________________________________________________________________________
    //                      Functions below this line
    //___________________________________________________________________________________

    //This function pulls the information from localStorage searchedCityNames array and generates the buttons for them.
    function init() {
        //This line grabs the data from localStorage, parses it, and sets it as variable storedCities
        var storedUserSearchData = JSON.parse(localStorage.getItem("userSearchObject"));

        //______Jquery for Materialize__________
        $("select").formSelect();

        $('.parallax').parallax();

        $('.collapsible').collapsible();
        //_____________________________________

        // If events weren't retrieved from localStorage, set the storedUserSearchData equal to userSearchObject.
        if (storedUserSearchData !== null) {

            userSearchObject = storedUserSearchData;
            //run a function for each index of userSearchObject that calls the renderSearchButtons function and makes a button based on search criteria.
            $.each(userSearchObject, function (index) {
                renderSearchButtons(userSearchObject[index].searchText, userSearchObject[index].DropDownChoice, userSearchObject[index].books, userSearchObject[index].movies, userSearchObject[index].games);
            });
        }
    };

    //This function is a generalized function that performs all the API searchs based on the given user search critieria.  This function is called in multiple click events
    function userAPISearch(userSearchValue, dropDownValue, bookCheckedBool, movieCheckedBool, gameCheckedBool) {
        //This line of code is necessary because if a user triggers both modals then a hidden style is automatically added to it and it will conflict with function of the site
        $("body").removeAttr("style");

        //These lines of code clear the page of previously rendered content when search button is clicked.
        $("#mainModalDiv").empty();
        $("#movieContent").empty();
        $("#movieContent").removeAttr("style");
        $("#gameContent").empty();
        $("#gameContent").removeAttr("style");
        $("#bookContent").empty();
        $("#bookContent").removeAttr("style");

        //this if statement runs the code within when keyword is selected in the dropdown
        if (gameCheckedBool === false && bookCheckedBool === false && movieCheckedBool === false) {

            var modalDiv = $("<div>").attr({ "class": "modal", "id": "checkboxModal" });
            var modalContentDiv = $("<div>").attr("class", "modal-content");
            var modalFooter = $("<div>").attr("class", "modal-footer");

            modalContentDiv.append($("<h4>").text("Notification: Please read "));
            modalContentDiv.append($("<p>").text("Checkbox not clicked.  Please check at least one."))

            modalFooter.append($("<a>").attr({ "href": "#!", "class": "modal-close waves-effect waves-green btn-flat" }).text("Close"));

            modalDiv.append(modalContentDiv);
            modalDiv.append(modalFooter);

            $("#mainModalDiv").append(modalDiv);

            //this line of code is important to initialize the modal before triggering it in the code to open
            $('.modal').modal();

            //this line of code grabs the modal div and opens it
            $("#checkboxModal").modal('open');
        }
        if (dropDownValue === "Keyword") {

            //this if statement is looking for the book checkbox to be checked
            if (bookCheckedBool === true) {

                googleBooksKeywordQuery(userSearchValue, googleBooksApiKey);
            }
            //this if statement is looking for the movie checkbox to be checked
            if (movieCheckedBool === true) {

                OMDBKeywordQuery(userSearchValue, OMDBApiKey);
            }
            //this if statement is looking for the game checkbox to be checked
            if (gameCheckedBool === true) {

                rawgKeywordQuery(userSearchValue);
            }
            // saveUserInput(userSearchValue, dropDownValue, bookCheckedBool, movieCheckedBool, gameCheckedBool);

            //this if statement runs the code within if Title is selected in the dropdown menu
        } else if (dropDownValue === "Title") {

            if (movieCheckedBool === true) {

                OMDBTitleQuery(userSearchValue, OMDBApiKey);
            }

            if (bookCheckedBool === true) {
                googleBooksTitleQuery(userSearchValue, googleBooksApiKey);
            }

            if (gameCheckedBool === true) {

                rawgTitleQuery(userSearchValue);
            }

            // saveUserInput(userSearchValue, dropDownValue, bookCheckedBool, movieCheckedBool, gameCheckedBool);

        } else {
            var modalDiv = $("<div>").attr({ "class": "modal", "id": "dropdownModal" });
            var modalContentDiv = $("<div>").attr("class", "modal-content");
            var modalFooter = $("<div>").attr("class", "modal-footer");

            modalContentDiv.append($("<h4>").text("Notification: Please read "));
            modalContentDiv.append($("<p>").text("Must choose a search criteria option in pulldown menu."))

            modalFooter.append($("<a>").attr({ "href": "#!", "class": "modal-close waves-effect waves-green btn-flat" }).text("Close"));
            modalDiv.append(modalContentDiv);
            modalDiv.append(modalFooter);

            $("#mainModalDiv").append(modalDiv);

            //this line of code is important to initialize the modal before triggering it in the code to open
            $('.modal').modal();
            //this line of code grabs the modal div and opens it
            $("#dropdownModal").modal('open');
        }

    };

    //This function saves the user search data criteria to userSearchObject which is then saved to localStorage.
    function saveUserInput(userSearchValue, dropDownOption, bookCheck, movieCheck, gameCheck) {
        //Grab the current userSearchObject array and push the new user input into it
        userSearchObject.push({ "searchText": userSearchValue, "DropDownChoice": dropDownOption, "books": bookCheck, "movies": movieCheck, "games": gameCheck });
        //Save the userSearchObject array with new search criteria in it to localStorage
        localStorage.setItem("userSearchObject", JSON.stringify(userSearchObject));
        //call the renderSearchButtons function and create a button for the search
        renderSearchButtons(userSearchValue, dropDownOption, bookCheck, movieCheck, gameCheck);
    };

    //Function that renders the search buttons and close button list under the search bar
    function renderSearchButtons(userSearchValue, dropDownOption, bookCheck, movieCheck, gameCheck) {

        var userSearch = $("<button>").addClass("userSearchListButton btn");
        var closeButton = $("<button>").addClass("btn-small waves-effect");
        var userSearchList = $("<ul>").addClass("searchList");
        var bookText = "";
        var movieText = "";
        var gameText = "";

        //Below if statements are used to control what is entered in text in the button
        if (bookCheck === true) {
            bookText = "book";
        }
        if (movieCheck === true) {
            movieText = "movie";
        }
        if (gameCheck === true) {
            gameText = "game";
        }

        closeButton.text("X");
        userSearch.text(userSearchValue + ": " + dropDownOption + ": " + bookText + " " + movieText + " " + gameText);
        userSearchList.append($("<li>").append(userSearch, closeButton));
        $("#searchDiv").append(userSearchList);
    }

    //This function sets the query url for searching by title and then calls the googelbooksQuery function
    function googleBooksTitleQuery(searchCriteria, apiKey) {


        var titleURL = "https://www.googleapis.com/books/v1/volumes?q=" + searchCriteria + "intitle:" + searchCriteria + "&printType=books&orderBy=relevance&key=" + apiKey;

        googleBooksQuery(titleURL);

    }

    //This function sets the query url for searching by keyword and then calls the googelbooksQuery function
    function googleBooksKeywordQuery(searchCriteria, apiKey) {


        var keywordURL = "https://www.googleapis.com/books/v1/volumes?q=" + searchCriteria + "&printType=books&orderBy=relevance&key=" + apiKey;

        googleBooksQuery(keywordURL);

    }

    //this function is set to run an ajax query to googlebooks api.  The parameter delivered for the function is the query url.
    function googleBooksQuery(googleBooksURL) {

        //__________________________________________________
        //___________Begin Code for Book Api (Googlebooks)_________
        //__________________________________________________
        // intitle: Returns results where the text following this keyword is found in the title.
        // inauthor: Returns results where the text following this keyword is found in the author.
        // inpublisher: Returns results where the text following this keyword is found in the publisher.
        // subject: Returns results where the text following this keyword is listed in the category list of the volume.
        // var titleSearch = "intitle";
        // var authorSearch = "inauthor";
        // var subjectSearch = "subject";
        // var printType = "books";

        //this code performs a get ajax query to the google books api with the url for the api call as the parameter
        $.ajax({
            url: googleBooksURL,
            method: "GET"
        }).then(function (respGoogleBooks) {

            var countRowDiv1 = 0;
            var rowDiv1 = $("<div>").attr("class", "row");

            //this opens the collapsible div when the results are rendered
            instance.open(1);

            //badge count
            $("#BookCount").text(respGoogleBooks.items.length);

            //this if statement runs the code when there are no items delivered by the api
            if (respGoogleBooks.totalItems === 0) {
                //this code calls the noResultsFound function.  The parameter needed is the div that the function will render the content into
                noResultsFound($("#bookContent"));
            }
            //This line is starting and a function that will run for each element of the googlebooks response object delivered by api
            $.each(respGoogleBooks.items, function (index) {

                //The below if statement, else statement and code within's purpose is to render only four objects with col classes into a div with class row.  Once four have been rendered a new row div is created.
                //this if statement runs the code within for the first four indexes (indexes: 0,1,2,3) of the response object.
                if (countRowDiv1 < 4) {

                    var colDiv1 = $("<div>").attr("class", "col s3");
                    var authorList = $("<ul>").attr("class", "row");

                    //line of code grabs the col div, creates a h6 tag in it, and then adds the title of the book from ajax resp object into it
                    rowDiv1.append(colDiv1.append($("<h6>").attr("class", "flow-text").text("Title: " + respGoogleBooks.items[index].volumeInfo.title)));
                    //line of code grabs the col div, creates a p tag, adds the designated classes, and then adds the subtitle for book from response objet in it
                    rowDiv1.append(colDiv1.append($("<p>").attr("class", "flow-text").text(respGoogleBooks.items[index].volumeInfo.subtitle)));
                    //line of code creates a p tag, adds designated classes, and adds the published date of book into it
                    rowDiv1.append(colDiv1.append($("<p>").attr("class", "flow-text").text("Published Date: " + respGoogleBooks.items[index].volumeInfo.publishedDate)));
                    if (respGoogleBooks.items[index].volumeInfo.imageLinks) {
                        //line of code that creates creates the img tag, adds the image to it, and places it into the proper div
                        rowDiv1.append(colDiv1.append($("<img>").attr({ "class": "responsive-img", "src": respGoogleBooks.items[index].volumeInfo.imageLinks.thumbnail, "alt": "Image" })));
                    }
                    // genTitleImgFromQuery(rowDiv1, colDiv1, respGoogleBooks.items[index].volumeInfo.title, bookImg);
                    genAuthorList(rowDiv1, colDiv1, authorList, respGoogleBooks.items[index].volumeInfo);

                    countRowDiv1++;
                    //This else runs once the countRowDiv variable hits four.  
                } else {
                    //line of code takes the rowDiv1 variable full of the rendered content from the first four indexes and appends it to the bookcontent div.
                    $("#bookContent").append(rowDiv1);
                    //this line of code essentially empties the rowdiv1 variable (since the content has already been appended) and resets it back to an empty div with class row.
                    rowDiv1 = $("<div>").attr("class", "row");
                    //this line of resets the countRowDiv1 variable back to 0;
                    countRowDiv1 = 0;
                }
                //This line of code exists here because if the response object returns a number of results that is not divisible by 4 a row is never completely filled and doesn't get appended to bookcontent div by else statment.
                $("#bookContent").append(rowDiv1);

            })
        });
    };

    //This function essentially changes the url for the generic OMDB ajax query to one that searches specifically for the title of the movie
    function OMDBTitleQuery(movie, apiKey) {

        var titleURL = "https://www.omdbapi.com/?t=" + movie + "&apikey=" + apiKey;

        //AJAX call
        $.ajax({
            url: titleURL,
            method: "GET"
        }).then(function (response) {

            //this opens the collapsible div when the results are rendered
            instance.open(0);

            if (response.Error === "Movie not found!") {
                noResultsFound($("#movieContent"));
            } else {

                var movieMain = $("<div>");
                movieMain.addClass("movie");

                //poster 
                var imgUrl = response.Poster;
                var image = $("<img>").attr("src", imgUrl);
                movieMain.append(image);

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


                $("#movieContent").append(movieMain);

                //badge count
                $("#MovieCount").text(1);
            }

        });

    }

    //This function changes the url for OMDB ajax query to one that searches for for movies based on a keyword 
    function OMDBKeywordQuery(keyword, apiKey) {

        var keywordURL = "https://www.omdbapi.com/?s=" + keyword + "&apikey=" + apiKey;

        //This code performs the ajax query call based on the URL and returns response object respKeywordMovie
        $.ajax({
            url: keywordURL,
            method: "GET"
        }).then(function (respKeywordMovie) {

            var countRowDiv3 = 0;
            var rowDiv3 = $("<div>").attr("class", "row");

            //if the object returns an error call noResultsFound function
            if (respKeywordMovie.Error === "Movie not found!") {
                noResultsFound($("#movieContent"));
            }

            //this opens the collapsible div when the results are rendered
            instance.open(0);

            //badge count
            $("#MovieCount").text(respKeywordMovie.Search.length)

            //execite a function for each index of respKeywordMovie.Search object
            $.each(respKeywordMovie.Search, function (index) {

                //The below if statement, else statement and code within's purpose is to render only four objects with col classes into a div with class row.  Once four have been rendered a new row div is created.
                //this if statement runs the code within for the first four indexes (indexes: 0,1,2,3) of the response object.
                if (countRowDiv3 < 3) {

                    var colDiv3 = $("<div>").attr("class", "col s12 m6 l4");

                    rowDiv3.append(colDiv3.append($("<p>").text("Title: " + respKeywordMovie.Search[index].Title)));
                    rowDiv3.append(colDiv3.append($("<p>").text("Type: " + respKeywordMovie.Search[index].Type)));
                    rowDiv3.append(colDiv3.append($("<p>").text("Release year: " + respKeywordMovie.Search[index].Year)));
                    rowDiv3.append(colDiv3.append($("<img>").attr({ "src": respKeywordMovie.Search[index].Poster, "alt": "Movie Poster" })));

                    countRowDiv3++;
                    //This else runs once the countRowDiv variable hits four. 
                } else {

                    $("#movieContent").append(rowDiv3);
                    rowDiv3 = $("<div>").attr("class", "row");
                    countRowDiv3 = 0;

                }
                //This line of code exists here because if the response object returns a number of results that is not divisible by 4 a row is never completely filled and doesn't get appended to bookcontent div by else statment.
                $("#movieContent").append(rowDiv3);

            })
        })

    }

    //This function performs the AJAX query to the Rawg (video Game) API based on the results including the user search value in the title
    function rawgKeywordQuery(searchCriteria) {
        //__________________________________________________
        //___________Begin Code for Game Api (Rawg)_________
        //__________________________________________________
        var queryRawg = "https://api.rawg.io/api/games?search=" + searchCriteria;

        //code for the ajax query call to the Rawg api
        $.ajax({
            url: queryRawg,
            method: "GET"
        }).then(function (respRawg) {
            console.log(respRawg);


            //variable that is created in order to limit the number of columns placed into generated row div as 4
            var countRowDiv2 = 0;
            var rowDiv2 = $("<div>").attr("class", "row");
            var divDontWant = $("<div>")

            //This if statement calls the noREsultsFound function if the Api brings back no results
            if (respRawg.count === 0) {
                noResultsFound($("#gameContent"));
            }

            //badge on game div
            $("#GameCount").text(respRawg.count)

            instance.open(2);

            //each function that runs for every index of the resp object returned by the ajax call to Rawg api
            $.each(respRawg.results, function (index) {

                //this if statement declares that the code will only run while count variable is less than 4. And it takes the response object and capitalizes the first letter of each word
                //and sees if the user search criteria value is included in the name of that index of the response object.  This was created because the Rawg Api pulls back games that even have 
                //parts of the searched value.  Example: "titanic" would bring backs games with the word "titan" in them  
                if (countRowDiv2 < 4 && respRawg.results[index].name.includes(CapitalizeWords(searchCriteria)) === true) {

                    var colDiv2 = $("<div>").attr("class", "col s3");
                    var genreList = $("<ul>").text("genres: ");

                    //this line of code calls function that grabs the name & image from Rawg Api and generates it into div parameters
                    genTitleImgFromQuery(rowDiv2, colDiv2, respRawg.results[index].name, respRawg.results[index].background_image);
                    //this line of code calls function that grabs genre object from Rawg Api and generates them into a list and writes it to div parameters
                    genGenreList(rowDiv2, colDiv2, genreList, respRawg.results[index]);

                    countRowDiv2++;

                } else if (respRawg.results[index].name.includes(CapitalizeWords(searchCriteria)) === false) {

                    //this line of code calls function that grabs the name & image from Rawg Api and generates it into div parameters
                    genTitleImgFromQuery(divDontWant, divDontWant, respRawg.results[index].name, respRawg.results[index].background_image);

                } else {

                    //this code appends the rowDiv1 variable filled with the four cols append in above code to the page into the div with gameContent id 
                    $("#gameContent").append(rowDiv2);
                    //This line of code clears the rowDiv1 variable and sets it to an empty div with class row.
                    rowDiv2 = $("<div>").attr("class", "row");
                    //sets the count variable to 0 so that it we can go back up to the above if statement code and start generating cols in rows again
                    countRowDiv2 = 0;
                }

                $("#gameContent").append(rowDiv2);
                divDontWant.empty();

            });
        });
    }

    //This function performs the AJAX query to the Rawg API with the title matching the user search value
    function rawgTitleQuery(searchCriteria) {
        //__________________________________________________
        //___________Begin Code for Game Api (Rawg)_________
        //__________________________________________________
        var queryRawg = "https://api.rawg.io/api/games?search=" + searchCriteria;

        //code for the ajax query call to the Rawg api
        $.ajax({
            url: queryRawg,
            method: "GET"
        }).then(function (respRawg) {
            console.log(respRawg);


            //variable that is created in order to limit the number of columns placed into generated row div as 4
            var countRowDiv2 = 0;
            var rowDiv2 = $("<div>").attr("class", "row");
            var divDontWant = $("<div>")

            //This if statement calls the noREsultsFound function if the Api brings back no results
            if (respRawg.count === 0) {
                noResultsFound($("#gameContent"));
            }

            //each function that runs for every index of the resp object returned by the ajax call to Rawg api
            $.each(respRawg.results, function (index) {

                //this if statement declares that the code will only run while count variable is less than 4. And it takes the response object and capitalizes the first letter of each word
                //and sees if the user search criteria value is included in the name of that index of the response object.  This was created because the Rawg Api pulls back games that even have 
                //parts of the searched value.  Example: "titanic" would bring backs games with the word "titan" in them  
                if (countRowDiv2 < 4 && respRawg.results[index].name === CapitalizeWords(searchCriteria)) {

                    var colDiv2 = $("<div>").attr("class", "col s3");
                    var genreList = $("<ul>").text("genres: ");

                    //this line of code calls function that grabs the name & image from Rawg Api and generates it into div parameters
                    genTitleImgFromQuery(rowDiv2, colDiv2, respRawg.results[index].name, respRawg.results[index].background_image);
                    //this line of code calls function that grabs genre object from Rawg Api and generates them into a list and writes it to div parameters
                    genGenreList(rowDiv2, colDiv2, genreList, respRawg.results[index]);

                    countRowDiv2++;

                } else if (respRawg.results[index].name === CapitalizeWords(searchCriteria)) {

                    //this line of code calls function that grabs the name & image from Rawg Api and generates it into div parameters
                    genTitleImgFromQuery(divDontWant, divDontWant, respRawg.results[index].name, respRawg.results[index].background_image);

                } else {

                    //this code appends the rowDiv1 variable filled with the four cols append in above code to the page into the div with gameContent id 
                    $("#gameContent").append(rowDiv2);
                    //This line of code clears the rowDiv1 variable and sets it to an empty div with class row.
                    rowDiv2 = $("<div>").attr("class", "row");
                    //sets the count variable to 0 so that it we can go back up to the above if statement code and start generating cols in rows again
                    countRowDiv2 = 0;
                }

                $("#gameContent").append(rowDiv2);
                divDontWant.empty();
            });
        });
    }

    //This function grabs the game name and image from the Rawg Api and appends it into a column div and then appends that column into the mainDiv parameter
    function genTitleImgFromQuery(mainDiv, column, name, img) {

        //line of code grabs the gamecontent col div, creates a h1 tag in it, and then adds the title of the game from ajax resp object into it
        mainDiv.append(column.append($("<h5>").attr("class", "flow-text").text("Name: " + name)));
        //line of code that creates creates the img tag, adds the image to it, and places it into the proper div
        mainDiv.append(column.append($("<img>").attr({ "class": "responsive-img", "src": img, "alt": "Image" })));

    }

    //This function grabs the genre object from the Rawg Api and places the info into a list which is appended into a column.  That column is then appened to the mainDiv parameter
    function genGenreList(mainDiv, column, listDiv, respObject) {

        //function that runs for every index of the genre array to grab the name and place it into an li item.
        $.each(respObject.genres, function (index) {

            listDiv.append($("<li>").text(respObject.genres[index].name))
            mainDiv.append(column.append(listDiv));

        });


    }

    //This function grabs an array appends each element to a list item.  Appends that to a list. Puts the list in a column.  And then the column in a  specified div.
    function genAuthorList(mainDiv, column, listDiv, respObject) {
        //function that runs for every index of the genre array to grab the name and place it into an li item.
        $.each(respObject.authors, function (index) {

            listDiv.append($("<li>").text(respObject.authors[index]));
            mainDiv.append(column.append(listDiv));

        });
    }

    //This function generates a row div with text "No results found" into the div specified as the parameter.
    function noResultsFound(mainDiv) {

        var rowDiv = $("<div>").attr("class", "row flow-text");

        mainDiv.append(rowDiv.append($("<h1>").text("No Results Found")));

    }

    //This function is used because Rawg api capitalizes the first letters of all its game titles.  So the user search value is run through this function in the rawg query functions above
    //to see if it is included in the title
    function CapitalizeWords(string) {

        var wordsArray = string.split(" ");

        var capitalizedString = "";

        wordsArray.forEach(function (index) {

            var length = index.length;
            var firstLetter = index.charAt(0);
            var restOfWord = index.slice(1, length);

            var capitalized = firstLetter.toUpperCase();
            var capitalizedWord = capitalized + restOfWord;

            capitalizedString = capitalizedString + " " + capitalizedWord;

        })

        word1 = capitalizedString.trim();
        return word1;
    }

});



