$(document).ready(function() {
  var lat;
  var long;
  
  var tempF;
  var tempC;
  var currentTemp;
  
  var newCity;
  
  // Dark Sky API key and formatted URL
  var key = "b3de1e3c7dd2d8741ccf344b96b90285";
  var api = "https://crossorigin.me/https://api.darksky.net/forecast/";
  
  /* retrieve location from browser */
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
        lat = position.coords.latitude;
        long = position.coords.longitude;
        
        // Google Maps API URL with user latitude and longitude
        var geocoding = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "%2C" + long + "&language=en";
        
      /* retrieve info from Google Maps API */
      function displayLocation(geocoding) {
        $.getJSON(geocoding).done(function(location) {
          var city = location.results[0].address_components[2].long_name;
          var state = location.results[0].address_components[4].long_name;
          var country = location.results[0].address_components[5].short_name;
          $("#location").html(city + ", " + state + ", " + country);
          
          // remove "Loading..." placeholder
          $("#loader").remove();
        }); 
      } // end display location function
     
      // Dark Sky API URL with added key, user longitude and latitude
      api += key + "/" + lat + "," + long;
      
      /* retrieve info from Dark Sky API */
      function getWeather(api) {
      $.getJSON(api, function(data) {
        tempF = Math.round(data.currently.temperature);
        tempC = Math.round((tempF - 32) * (5/9));
        
        // display default Dark Sky temperature reading (in F) on page
        $("#temp").html(tempF + "°F");
        // numerical temperature reading stripped of extra symbols
        currentTemp = $("#temp").text().replace(/[^0-9]/g, '');
        
        // remove "Loading..." placeholder if it still appears
          $("#loader").remove();
        
        // display weather summary on page
        $("#summary").html(data.currently.summary);
        
         
        $("#icon").removeClass("inactive"); // makes element active if not previously
        // display weather icons from Dark Sky
        var skycons = new Skycons({"color":"white"});
        skycons.add("icon", data.currently.icon);
        skycons.play();
        
      }); // end JSON call
      } // end get weather function
      
      displayLocation(geocoding);
      getWeather(api);
      
        // convert displayed temperature to Fahrenheit or Celsius
        function convertTemp(temp) {
          if (temp == tempF) {
            $("#temp").html(tempC + "°C");
            currentTemp = $("#temp").text().replace(/[^0-9]/g, '');
            $("#convert").html("Convert to °F");
          } else {
            $("#temp").html(tempF + "°F");
            currentTemp = $("#temp").text().replace(/[^0-9]/g, '');
            $("#convert").html("Convert to °C");
          }
        } // end conversion function
      
        // button to convert temperature scale
        $("#convert").on("click", function () {
          convertTemp(currentTemp);
        });
      
      /* retrieve and display weather from user input location */
      function displayWeatherFromInput() {
        newCity = $("#city-input").val();
  
        var cityURL = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + newCity + '';
        // use city input to get latitude and longitude
        $.getJSON(cityURL).done(function(location) {
          if (location.status === "ZERO_RESULTS" || newCity.match(/^[0-9a-zA-Z]+$/)) {
            $("#location").html("Location Unavailable");
            $("#temp").html("");
            $("#summary").html("");
            $("#icon").addClass("inactive");
            
            // display error icon
            $("#icon-error").html('<span class="glyphicon glyphicon-remove"></span>');

            // disable conversion button
            $("#convert").prop("disabled", true);
            
            $("#alert").removeClass("inactive"); // display alert
          } else {
            var cityLat = location.results[0].geometry.location.lat;
            var cityLong = location.results[0].geometry.location.lng;
         
            $("#location").html(newCity); // display user input as location
    
            // retrieve weather for new city coordinates
            var newCityWeather = 'https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/b3de1e3c7dd2d8741ccf344b96b90285/' + cityLat + ',' + cityLong;
            getWeather(newCityWeather);
            // reset conversion button to default
            $("#convert").html("Convert to °C");

            // enable conversion button
            $("#convert").prop("disabled", false);
          
            $("#icon-error").html('');

            } // end if/else
        }) // end done
        .fail(function() {
          $("#summary").html("Failed to load weather data");
          $("#icon").addClass("inactive");
          $("#icon-error").html('<span class="glyphicon glyphicon-remove"></span>');
        }); // end fail/JSON call
      } // end display weather from input function

      // click search icon to get weather from input
      $("#search").on("click", function() {
        displayWeatherFromInput();
        if (newCity === "") { // if user did not enter a city
            $("#location").html("Location Unavailable");
            $("#temp").html("");
            $("#summary").html("");
            $("#icon").addClass("inactive");
            
            // display error icon
            $("#icon-error").html('<span class="glyphicon glyphicon-remove"></span>'); 

            // disable conversion button
            $("#convert").prop("disabled", true);
          
          $("#alert").removeClass("inactive"); // display alert box
        } else {
          //$("#icon").removeClass("inactive"); // icon reappears 
          $("#icon-error").html(''); // remove error icon

          // enable conversion button
            $("#convert").prop("disabled", false);

          $("#alert").addClass("inactive"); // remove alert box
        } // end if/else
      }); // end click event function

      // on enter to get weather from input
      $("#city-input").on("keyup", function(event) {
        if (event.which === 13) {
          displayWeatherFromInput();
        }
        if (newCity === "") {
          $("#location").html("Location Unavailable");
            $("#temp").html("");
            $("#summary").html("");
            $("#icon").addClass("inactive");
            
            // display error icon
            $("#icon-error").html('<span class="glyphicon glyphicon-remove"></span>');

            // disable conversion button
            $("#convert").prop("disabled", true);
          
          $("#alert").removeClass("inactive"); // display alert box
        } else {
          //$("#icon").removeClass("inactive"); // icon reappears
          $("#icon-error").html(''); // remove error icon
          
          // enable conversion button
            $("#convert").prop("disabled", false);

          $("#alert").addClass("inactive"); // remove alert box
        } // end if/else
      }); // end enter input event
      
    }); // end navigator
    
    
    
    // before url: https://cors-anywhere.herokuapp.com/, crossorigin.me
    // url format: https://api.darksky.net/forecast/[key]/[latitude],[longitude]
    // Dark Sky key: b3de1e3c7dd2d8741ccf344b96b90285
    // Google Maps api url: https://maps.googleapis.com/maps/api/geocode/json?latlng=' + position.coords.latitude + '%2C' + position.coords.longitude + '&language=en'
    // Google Maps key: AIzaSyA_2Y1wkrqSlqiycIX54sNS--xLvzssw-E
    
    
} // end if geolocation




}); // document ready

