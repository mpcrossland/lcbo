var wineApp = {};
wineApp.key = 'MDo5OTU2YzIwNi00MDBmLTExZTctYWM5Yy1mYjc2NTU4ZGFjYjM6V3B5Z0VUb0hGbHRHVGRSSlNSZW1iMHE1UGgwU1F1ZFJJT1Za';

//all the functions will be run through this parent function called init.
wineApp.init = function(){
    wineApp.getWine();
};



    //Allow user to make a selection of parameters.
    //When user submits form, we want to display only those wine..
wineApp.userSelection = function(wineObject){
    $('.userSelections').on('submit', function(e){
        e.preventDefault();
        var typeChoice = $('input[name=type]:checked').val();
        var priceChoice = $('select[name=price] option:selected').val();
        var countryChoice = $('select[name=country] option:selected').val();
        var styleChoice = 'none'; //changed this to NONE because allowing a choice in style was returning too little results.

        var selectedType = (wineObject[typeChoice]);
        if (typeChoice === undefined)
          {
              alert("You must select a type of wine.");
              return false;
          }
          // console.log(priceChoice);


        //creates a variable for all the wine in the COUNTRY the user selected.
        var re = new RegExp(countryChoice,'ig');
        var filteredCountry = selectedType.filter(function(country){
            if (countryChoice === "none"){
                return true;
            } else {  
                return country.origin.match(re); 
                }
        });
        // console.log(filteredCountry);

        //creates a variable for all the wine within the PRICE range the user selected.
        const bounds = priceChoice.split('-');
        const wineFilter = (price, min, max) => (price > min) && (price <= max);
        const filteredPrice = filteredCountry.filter(wine => wineFilter(wine.price_in_cents, bounds[0], bounds[1] || Infinity));



        //creates a variable for all the wine within the STYLE  the user selected.
        var filteredStyle = filteredPrice.filter(function(style) {
            if (style.style == styleChoice){
                return true;
            }
            else if (styleChoice === "none"){
                return true;
            };
        });

        $('#wineContainer').empty();
        if (filteredStyle.length === 0){
            $('#wineContainer').html('<p>Sorry, no results found. Try selecting "No Preference".</p>');
        };


        //putting all filtered results into a div called results
        filteredStyle.forEach(function(result){
            const resultContainer = $('<div>').addClass('redWine');
            const resultName = $('<h2>').addClass('wineName').text(result.name);
            const resultPrice = $('<p>').addClass('winePrice').text('Price ' +' $ ' + result.price_in_cents / 100);
            const resultCountry = $('<p>').addClass('wineOrigin').text(result.origin);
            const resultStyle = $('<p>').text(result.style);
            const resultImage = $('<img>').attr('src', result.image_thumb_url);

            resultContainer.append(resultPrice,resultName,resultCountry, resultStyle, resultImage);
            $('#wineContainer').append(resultContainer);
        });

    });  //<----userSelection on submit function
 };


//Getting all wine types from AJAX, storing it in .getWineByType function
wineApp.getWineByType = function(wineType){
    return $.ajax({
        url: 'https://lcboapi.com/products',
        headers: { 'Authorization': 'Token MDo5OTU2YzIwNi00MDBmLTExZTctYWM5Yy1mYjc2NTU4ZGFjYjM6V3B5Z0VUb0hGbHRHVGRSSlNSZW1iMHE1UGgwU1F1ZFJJT1Za' },
        method: 'GET',
        dataType: 'json',
        data: {
            per_page: 100,
            q: wineType
        }
    });
}

// CREATING A SEARCH ARRAY OF WINES.
// const endpoint = 'https://lcboapi.com/products?access_key=MDo5OTU2YzIwNi00MDBmLTExZTctYWM5Yy1mYjc2NTU4ZGFjYjM6V3B5Z0VUb0hGbHRHVGRSSlNSZW1iMHE1UGgwU1F1ZFJJT1Za';
// const wines = [];

// fetch(endpoint)
//     .then(blob => blob.json())
//     .then(data => wines.push(data.result))
//     console.log(wines);

// function findMatches(wordToMatch, search) {
//     return wines.filter(search => {
//         //here we need to figure out if text matches what was searched.
//         const regex = new RegExp(wordToMatch, 'gi');
//         return search.name.match(regex)  || search.tags.match(regex);
//     });
// }




// Gets the wines by type, then creating variables (wineApp.getWine.RedWineData)
wineApp.getWine = function() {
    $.when(wineApp.getWineByType("Red Wine"),wineApp.getWineByType("White Wine"))
    .then(function(redWine, whiteWine){
        var redWineData = redWine[0]
        var whiteWineData = whiteWine[0]


        var wineObject = {
            redWine: redWineData.result,
            whiteWine: whiteWineData.result
        }

        wineApp.userSelection(wineObject);

        redWineData.result.forEach(function(wine){

                //Creating variables for the info i want on the DOM
            var nameElement = $('<h2>').addClass('wineName').text(wine.name);
            var priceElement = $('<p>').addClass('winePrice').text("Price " +' $ ' + wine.price_in_cents / 100);
            var originElement = $('<p>').addClass('wineOrigin').text(wine.origin);
            var styleElement = $('<p>').addClass('wineStyle').text(wine.style);
            var imageElement = $('<img>').attr('src', wine.image_thumb_url);

                //putting them all in one single variable
            var wineInfo = $('<div>').addClass('redWine').append(nameElement, priceElement, originElement, styleElement, imageElement);
                //appending that single variable into the DOM
            $('#wineContainer').append(wineInfo);
        })
                ///DOing the same thing for WhiteWine
                
        whiteWineData.result.forEach(function(wine){

                //Creating variables for the info i want on the DOM
            var nameElement = $('<h2>').text(wine.name);
            var priceElement = $('<p>').text("Price " +' $ ' + wine.price_in_cents / 100);
            var originElement = $('<p>').text(wine.origin);
            var styleElement = $('<p>').text(wine.style);
            var imageElement = $('<img>').attr('src', wine.image_thumb_url);

                //putting them all in one single variable
            var wineInfo = $('<div>').addClass('whiteWine').append(nameElement, priceElement, originElement, styleElement, imageElement);
                
                //appending that single variable into the DOM
            $('#wineContainer').append(wineInfo);
        })
    });
};

$( ".cross" ).hide();
$( ".hMenu" ).hide();
$( ".hamburger" ).click(function() {
$( ".hMenu" ).slideToggle( "slow", function() {
$( ".hamburger" ).hide();
$( ".cross" ).show();
});
});

$( ".cross" ).click(function() {
$( ".hMenu" ).slideToggle( "slow", function() {
$( ".cross" ).hide();
$( ".hamburger" ).show();
});
});

//create an event listener for users choices that will filter through my list of content and only show those items.


//the single function to rule them all.
$(document).ready(function(){
    wineApp.init();
});
