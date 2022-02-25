// global variables
var submitButton = document.querySelector("#submit")
var searchInputEl = document.querySelector("#search-input")
var currentWeatherEl = document.querySelector("#current-weather-section")
var dailyWeatherEl = document.querySelector("#forecast-section")

var savedCities = JSON.parse(localStorage.getItem("cityListObj"))

var citySubmitHandler = function(event) {
    // prevent page refresh
    event.preventDefault();

    // get city from input
    var city = searchInputEl.value.trim();

    if (city) {
        getCityCoordinates(city);

        // clear old content
        currentWeatherEl.textContent = "";
        dailyWeatherEl.textContent = "";
    } else {
        alert("Please enter a valid city.")
        return false;
    }

    // append weather container to page

    // append city header to page
    var cityEl = document.createElement("h2");
    cityEl.textContent = city;
    currentWeatherEl.appendChild(cityEl)

    // save city to local storage
    var savedCities = {
        value: city,
        }

        savedCitiesList.push(savedCities);
        localStorage.setItem("cities", JSON.stringify(savedCitiesList));


    // append cities into buttons

}


// get the API
var getCityCoordinates = function(city) {

    // API url
    var requestUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&units=imperial&appid=242a029e7df5879d31497e5779e1483e"

    // fetch request
    fetch(requestUrl).then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                getWeatherData(data[0].lat, data[0].lon);
            })
        } else {
            alert("error: City Not Found");
        }
    })
}

// get the API
function getWeatherData(lat, lon) {

    // API url
    var requestUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=242a029e7df5879d31497e5779e1483e"

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
    // check if api returned any repos
    if (weatherData.length === 0) {
        repoContainerEl.textContent = "No results found.";
        return;
    }

    // format date
    var unixTime = weatherData.current.dt;
    var formatDate = new Date (unixTime * 1000)
    var date = formatDate.toLocaleDateString()

    // append date to page
    var dateEl = document.createElement("h2")
    dateEl.textContent = date
    currentWeatherEl.appendChild(dateEl) 

    // append icon to page
    var iconEl = document.createElement("img");
    iconEl.src = "http://openweathermap.org/img/wn/" + weatherData.current.weather[0].icon + ".png";
    var src = document.getElementById("current-weather-section");
    currentWeatherEl.appendChild(iconEl);

    // append current weather data to page
    var tempEl = document.createElement("p");
    tempEl.textContent = "Temp: " + weatherData.current.temp + "°F";
    currentWeatherEl.appendChild(tempEl)

    var windEl = document.createElement("p");
    windEl.textContent = "Wind: " + weatherData.current.wind_speed + " MPH";
    currentWeatherEl.appendChild(windEl)

    var humidityEl = document.createElement("p");
    humidityEl.textContent = "Humidity: " + weatherData.current.humidity + "%";
    currentWeatherEl.appendChild(humidityEl)

    var uviEl = document.createElement("p");
    uviEl.textContent = "UV Index: " + weatherData.current.uvi;
    currentWeatherEl.appendChild(uviEl)

    // loop over weather to get next 5 days
    for (var i = 1; i < 6; i++) {

        // create div elements with classes
        var dailyWeatherBox = document.createElement('div');
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