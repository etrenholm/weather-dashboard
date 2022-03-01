// global variables
var submitButton = document.querySelector("#submit")
var cityButtons = document.querySelector("#city-button-section")
var searchInputEl = document.querySelector("#search-input")
var currentWeatherEl = document.querySelector("#current-weather-section")
var cityTitleRowEl = document.querySelector("#city-title-row")
var dailyWeatherEl = document.querySelector("#forecast-section")
var cityButtonSectionEl = document.querySelector("#city-button-section")
var forecastBox = document.querySelector("#forecast-header")
var uviRowEl = document.querySelector("#uvi-row")

var apiKey = "242a029e7df5879d31497e5779e1483e";

// get cities from local storage
var citiesArr = JSON.parse(localStorage.getItem('cities')) || [];


var citySubmitHandler = function(event) {
    // prevent page refresh
    event.preventDefault();

    // get city from input
    var city = searchInputEl.value.trim();

    if (city) {
        getCityCoordinates(city);
        
    } else {
        alert("Please enter a valid city.")
        return false;
    }
}

var cityClickHandler = function(event) {
    if(event.target.id) {
        getCityCoordinates(event.target.id)
    }
}

// get the API
var getCityCoordinates = function(city) {

    // API url
    var requestUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&units=imperial&appid=" + apiKey;

    // fetch request
    fetch(requestUrl).then(function(response) {
        response.json().then(function(data) {
            if(data.length === 0) {
            currentWeatherEl.textContent = "No results found.";
            return;
            }
            // clear old content
            currentWeatherEl.textContent = "";
            cityTitleRowEl.textContent = "";
            dailyWeatherEl.textContent = "";
            searchInputEl.value = "";
            forecastBox.textContent = "";
            uviRowEl.textContent = "";

            // append city header to page
            currentWeatherEl.appendChild(cityTitleRowEl)
            var cityEl = document.createElement("h2");
            cityEl.textContent = data[0].name;
            cityTitleRowEl.appendChild(cityEl)


            if (!citiesArr.includes(data[0].name)) {
                // append new city to side
                var cityButtonEl = document.createElement("button");
                cityButtonEl.setAttribute("id", data[0].name)
                cityButtonEl.addEventListener("click", cityClickHandler);
                cityButtonEl.className = "city-btn btn"
                cityButtonEl.textContent = data[0].name;
                cityButtonSectionEl.appendChild(cityButtonEl);

                // save cities to local storage
                citiesArr.push(data[0].name);
                localStorage.setItem('cities', JSON.stringify(citiesArr));
            }
            
            getWeatherData(data[0].lat, data[0].lon);
        })
    })
}

// get the API
function getWeatherData(lat, lon) {

    // API url
    var requestUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + apiKey;

    // fetch request
    fetch(requestUrl).then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                displayWeatherData(data)
            })
        }
    })
}

var displayWeatherData = function(weatherData) {
    if(weatherData.length === 0) {
    currentWeatherEl.textContent = "No results found.";
    return;
    }

    // format date
    var unixTime = weatherData.current.dt;
    var formatDate = new Date (unixTime * 1000)
    var date = formatDate.toLocaleDateString()

    // append date to city title row
    var dateEl = document.createElement("h2")
    dateEl.textContent = "(" + date + ")";
    cityTitleRowEl.appendChild(dateEl) 

    // append icon to city title row
    var iconEl = document.createElement("img");
    iconEl.src = "http://openweathermap.org/img/wn/" + weatherData.current.weather[0].icon + ".png";
    var src = document.getElementById("current-weather-section");
    cityTitleRowEl.appendChild(iconEl);

    // append current weather data to current weather section
    var tempEl = document.createElement("p");
    tempEl.textContent = "Temp: " + weatherData.current.temp + "°F";
    currentWeatherEl.appendChild(tempEl)

    var windEl = document.createElement("p");
    windEl.textContent = "Wind: " + weatherData.current.wind_speed + " MPH";
    currentWeatherEl.appendChild(windEl)

    var humidityEl = document.createElement("p");
    humidityEl.textContent = "Humidity: " + weatherData.current.humidity + "%";
    currentWeatherEl.appendChild(humidityEl)

    // append uv index to current weather section
    currentWeatherEl.appendChild(uviRowEl)
    var uviEl = document.createElement("p");
    var uviCondition = document.createElement("p");

    uviEl.textContent = "UV Index: "
    console.log(uviEl.textContent)
    uviCondition.textContent = weatherData.current.uvi

    uviRowEl.appendChild(uviEl)
    uviRowEl.appendChild(uviCondition)

    // check for UV Index conditions
    if (weatherData.current.uvi <= 2) {
        uviCondition.className = "favorable"
    } else if (weatherData.current.uvi >= 7) {
        uviCondition.className = "severe"
    } else {
        uviCondition.className = "moderate"
    }

    // append 5 day forecast container to page
    var dayHeaderEl = document.createElement("h3");
    dayHeaderEl.textContent = "5-Day Forecast:"
    forecastBox.appendChild(dayHeaderEl)

    // loop over weather to get next 5 days
    for (var i = 1; i < 6; i++) {

        // create div elements with classes
        var dailyWeatherBox = document.createElement("div");
        dailyWeatherBox.className = "day-block"

        // format date
        var unixTime = weatherData.daily[i].dt;
        var formatDate = new Date (unixTime * 1000)
        var date = formatDate.toLocaleDateString()

        // create date element and append to box
        var dailyDateEl = document.createElement("h4")
        dailyDateEl.textContent = date
        dailyWeatherBox.appendChild(dailyDateEl) 

        // create icon element and append to box
        var iconEl = document.createElement("img");
        iconEl.src = "http://openweathermap.org/img/wn/" + weatherData.daily[i].weather[0].icon + ".png";
        var src = document.getElementById("forecast-section");
        dailyWeatherBox.appendChild(iconEl);    

        // create temp element and append to box
        var dailyTempEl = document.createElement("p")
        dailyTempEl.textContent = "Temp: " + weatherData.daily[i].temp.day + "°F";
        dailyWeatherBox.appendChild(dailyTempEl);

        // create wind element and append to box
        var dailyWindEl = document.createElement("p")
        dailyWindEl.textContent = "Wind: " + weatherData.daily[i].wind_speed + " MPH";
        dailyWeatherBox.appendChild(dailyWindEl);

        // create wind element and append to box
        var dailyHumidiyEl = document.createElement("p")
        dailyHumidiyEl.textContent = "Humidity: " + weatherData.daily[i].humidity + "%";
        dailyWeatherBox.appendChild(dailyHumidiyEl);

        // append box to container
        dailyWeatherEl.appendChild(dailyWeatherBox)

    }

}

submitButton.addEventListener("click", citySubmitHandler);

// create buttons from local storage on page refresh
for (var i = 0; i < citiesArr.length; i++) {
    var cityButtonEl = document.createElement("button");
    cityButtonEl.className = "city-btn btn"
    cityButtonEl.setAttribute("id", citiesArr[i])
    cityButtonEl.addEventListener("click", cityClickHandler);
    cityButtonEl.textContent = citiesArr[i];
    cityButtonSectionEl.appendChild(cityButtonEl);
}