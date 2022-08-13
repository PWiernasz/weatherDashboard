var weatherUrl = "https://api.openweathermap.org/data/2.5/weather?q=";
var oneCallUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=";
var exclude = "&exclude=minutely,hourly,alerts&units=imperial";
var apikey = "&cnt=5&appid=e17aa626a731e1d6b0e761d67d3f776c";
var counter = 0;
var savedCities = [];
var cities = document.querySelector("#cities");
var searchButton = document.getElementById("search");


function saveSearch(city){
    var savedCity = document.createElement("button");
    savedCity.setAttribute("id", city);
    savedCity.className = "search button";
    savedCity.textContent = city;
    savedCity.addEventListener("click", function(){
        displayCity(this.id);
    });

    cities.appendChild(savedCity);
    savedCities.push(city);
    localStorage.setItem("savedCities", JSON.stringify(savedCities));
    counter++;
}

function loadSearch(){
    savedCities = JSON.parse(localStorage.getItem(savedCities)) || [];
    for (i = 0; i < savedCities.length; i++){
        var savedCity = document.createElement("button");
        savedCity.setAttribute("id", savedCities[i]);
        savedCity.className = "search button";
        savedCity.textContent = savedCities[i];
        savedCity.addEventListener("click", function(){
            displayCity(this.id);
        });
        cities.appendChild(savedCity);
    }

}

function displayForecast(data) {
    var forecastEl = document.getElementById("forecast");
    forecastEl.innerHTML = "";
    var rowEl = document.createElement("div");
    rowEl.classList = "columns is-mobile mt-5";
    forecastEl.appendChild(rowEl);

    for (i=0;i<5;i++) {

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

        dateEl.textContent = moment().add(i+1, 'days').format('MM/DD/YY'); 
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

function displayCity(citySearch) {
    if (!citySearch) {
        return false;
    }
    
    fetch(weatherUrl + citySearch + apikey)
    .then(function(response) {
        return response.json();
    }).then(function(data) {
            console.log(data);
            var currentCity = data.name
            var latitude = data.coord.lat;
            var longitude = data.coord.lon;
            fetch(oneCallUrl + latitude + "&lon=" + longitude + exclude + apikey)
            .then(function(response) {
                return response.json();
            }).then(function(data) {
                console.log(data);

                var iconMain = document.createElement("img");
                var iconSource = "http://openweathermap.org/img/wn/" + data.current.weather[0].icon + "@2x.png";
                iconMain.setAttribute("src", iconSource);

                var temperature = data.current.temp;
                var windSpeed = data.current.wind_speed;
                var humidity = data.current.humidity;
                var uvIndex = data.current.uvi;

                document.getElementById("city").textContent = currentCity + moment().format(' (MM/DD/YY)') + " ";
                document.getElementById("city").appendChild(iconMain);
                document.getElementById("temperature").textContent = "Temp: " + temperature + " F";
                document.getElementById("wind").textContent = "Wind: " + windSpeed + " MPH";
                document.getElementById("humidity").textContent = "Humidity: " + humidity + "%";
                document.getElementById("uvIndex").textContent = "UV Index: ";

                var uvBox = document.createElement("div");
                uvBox.setAttribute("id", "uv-box");
                uvBox.textContent = uvIndex;
                document.getElementById("uvIndex").appendChild(uvBox);

                if (uvIndex < 3) {
                    document.getElementById("uv-box").style.backgroundColor = "green";
                } else if (uvIndex < 6) {
                    document.getElementById("uv-box").style.backgroundColor = "yellow";
                } else if (uvIndex < 8) {
                    document.getElementById("uv-box").style.backgroundColor = "orange";
                } else if (uvIndex < 11) {
                    document.getElementById("uv-box").style.backgroundColor = "red";
                } else  {
                    document.getElementById("uv-box").style.backgroundColor = "purple";
                }
                displayForecast(data);
            })
    });   
    document.getElementById("city-search").value = "";
}

loadSearch();

searchButton.addEventListener("click", function(){
    var citySearch =document.getElementById("city-search").value;
    displayCity(citySearch);
    saveSearch(citySearch);
});