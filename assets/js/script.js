var counter = 0;
var savedCities = [];
var cities = document.querySelector("#cities");
var searchButton = document.getElementById("search");


//gets users current location through the browser and displays current weather for that locatoin
window.addEventListener('load', () => {
    let lon;
    let lat;
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            lon = position.coords.longitude;
            lat = position.coords.latitude;

            const api = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=imperial&cnt=5&appid=e17aa626a731e1d6b0e761d67d3f776c`;

            fetch(api)
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    console.log(data);
                    var currentCity = data.name
                    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=imperial&cnt=5&appid=e17aa626a731e1d6b0e761d67d3f776c`)
                        .then(response => {
                            return response.json();
                        }).then(data => {
                            console.log(data);

                            currentWeather(data);
                            uvCheck(data);
                            Forecast(data);
                        })
                });

        });
    }
});

// display current weather for location
function currentWeather(data) {
    var { temp, humidity, wind_speed, uvi } = data.current

    document.getElementById("city").textContent = "Current Location" + moment().format(' (MM/DD/YY)') + " ";
    document.getElementById("icon").setAttribute("src", "http://openweathermap.org/img/wn/" + data.current.weather[0].icon + "@2x.png");
    document.getElementById("temperature").textContent = "Temp: " + temp + " F";
    document.getElementById("wind").textContent = "Wind: " + wind_speed + " MPH";
    document.getElementById("humidity").textContent = "Humidity: " + humidity + "%";
    document.getElementById("uvIndex").textContent = "UV Index: ";

};


function saveSearch(city) {
    var savedCity = document.createElement("button");
    savedCity.setAttribute("id", city);
    savedCity.className = "search button";
    savedCity.textContent = city;
    savedCity.addEventListener("click", function () {
        getWeather(this.id);
    });

    cities.appendChild(savedCity);
    savedCities.push(city);
    localStorage.setItem("savedCities", JSON.stringify(savedCities));
    counter++;
}

function loadSearch() {
    savedCities = JSON.parse(localStorage.getItem(savedCities)) || [];
    for (i = 0; i < savedCities.length; i++) {
        var savedCity = document.createElement("button");
        savedCity.setAttribute("id", savedCities[i]);
        savedCity.className = "search button";
        savedCity.textContent = savedCities[i];
        savedCity.addEventListener("click", function () {
            getWeather(this.id);
        });
        cities.appendChild(savedCity);
    }

}

// displays 5 day forcast 
function Forecast(data) {
    var forecastEl = document.getElementById("forecast");
    forecastEl.innerHTML = "";
    var rowEl = document.createElement("div");
    rowEl.classList = "columns is-mobile mt-5";
    forecastEl.appendChild(rowEl);

    for (i = 0; i < 5; i++) {

        var cardEl = document.createElement("div");
        cardEl.setAttribute("style", "background-color: #5aa2e9");
        var dateEl = document.createElement("div");
        var iconEl = document.createElement("img");
        var tempEl = document.createElement("div");
        var windEl = document.createElement("div");
        var humidityEl = document.createElement("div");

        cardEl.classList = "column is-2 card box fiveday ml-3 mr-4";
        dateEl.classList = "key";
        tempEl.classList = "key";
        windEl.classList = "key";
        humidityEl.classList = "key";

        var iconImg = 'http://openweathermap.org/img/wn/' + data.daily[i].weather[0].icon + '@2x.png';
        iconEl.setAttribute("src", iconImg);

        dateEl.textContent = moment().add(i + 1, 'days').format('MM/DD/YY');
        tempEl.textContent = "Temp: " + data.daily[i].temp.day + " F";
        windEl.textContent = "Wind: " + data.daily[i].wind_speed + " MPH";
        humidityEl.textContent = "Humidity: " + data.daily[i].humidity + "%";


        cardEl.appendChild(dateEl);
        cardEl.appendChild(iconEl);
        cardEl.appendChild(tempEl);
        cardEl.appendChild(windEl);
        cardEl.appendChild(humidityEl);
        rowEl.appendChild(cardEl);
    }

}

//function to set uv index background color
function uvCheck(data) {
    var { uvi } = data.current
    var uvBox = document.createElement("div");
    uvBox.setAttribute("id", "uvAlert");
    uvBox.textContent = uvi;
    document.getElementById("uvIndex").appendChild(uvBox);

    if (uvi < 3) {
        document.getElementById("uvAlert").style.backgroundColor = "green";
    } else if (uvi < 6) {
        document.getElementById("uvAlert").style.backgroundColor = "yellow";
    } else if (uvi < 8) {
        document.getElementById("uvAlert").style.backgroundColor = "orange";
    } else if (uvi < 11) {
        document.getElementById("uvAlert").style.backgroundColor = "red";
    } else {
        document.getElementById("uvAlert").style.backgroundColor = "purple";
    }
};

// get weather for city based on search
function getWeather(getCity) {
    const api = `https://api.openweathermap.org/data/2.5/weather?q=${getCity}&units=imperial&appid=e17aa626a731e1d6b0e761d67d3f776c`;

    fetch(api)
        .then(response => {
            return response.json();
        })
        .then(data => {
            console.log(data);
            var currentCity = data.name
            var lat = data.coord.lat;
            var lon = data.coord.lon;
            fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=imperial&cnt=5&appid=e17aa626a731e1d6b0e761d67d3f776c`)
                .then(response => {
                    return response.json();
                }).then(data => {
                    console.log(data);

                    currentWeather(data);
                    uvCheck(data);
                    Forecast(data);
                })
        });
    document.getElementById('city-search').value = "";
}

loadSearch();

searchButton.addEventListener("click", function () {
    var getCity = document.getElementById("city-search").value;
    getWeather(getCity);
    saveSearch(getCity);
});