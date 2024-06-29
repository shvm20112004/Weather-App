document.addEventListener("DOMContentLoaded", () => {
    const apiKey = "0084d4d88b2844d0ccb0a093ddca7cb7";
    const searchButton = document.getElementById("search");
    const searchBar = document.getElementById("search-bar");
    const currentLocationButton = document.querySelector("#current-location");

    init();

    function init() {
        fetchWeatherData("Delhi");
        fetchForecastData("Delhi");

        searchButton.addEventListener("click", handleSearch);
        currentLocationButton.addEventListener("click", handleCurrentLocation);
    }

    function handleSearch() {
        const city = searchBar.value;
        if (city) {
            fetchWeatherData(city);
            fetchForecastData(city);
        }
    }

    function handleCurrentLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const { latitude, longitude } = position.coords;
                fetchWeatherDataByCoordinates(latitude, longitude);
                fetchForecastDataByCoordinates(latitude, longitude);
            });
        }
    }

    function fetchWeatherData(city) {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
            .then(response => response.text())
            .then(data => {
                const weatherData = eval("(" + data + ")");
                displayCurrentWeather(weatherData);
            })
            .catch(error => console.error('Error fetching weather data:', error));
    }

    function fetchWeatherDataByCoordinates(lat, lon) {
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
            .then(response => response.text())
            .then(data => {
                const weatherData = eval("(" + data + ")");
                displayCurrentWeather(weatherData);
            })
            .catch(error => console.error('Error fetching weather data:', error));
    }

    function fetchForecastData(city) {
        fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`)
            .then(response => response.text())
            .then(data => {
                const forecastData = eval("(" + data + ")");
                displayForecast(forecastData);
            })
            .catch(error => console.error('Error fetching forecast data:', error));
    }

    function fetchForecastDataByCoordinates(lat, lon) {
        fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
            .then(response => response.text())
            .then(data => {
                const forecastData = eval("(" + data + ")");
                displayForecast(forecastData);
            })
            .catch(error => console.error('Error fetching forecast data:', error));
    }

    function displayCurrentWeather(data) {
        document.getElementById("temp").textContent = data.main.temp + "°C";
        document.getElementById("current-condition").textContent = data.weather[0].description;
        document.getElementById("location").textContent = data.name;
        document.getElementById("current-img").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

        document.getElementById("sunrise-time").textContent = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
        document.getElementById("sunset-time").textContent = new Date(data.sys.sunset * 1000).toLocaleTimeString();
        document.getElementById("precipitation").textContent = (data.rain ? data.rain["1h"] : 0) + " mm";
        document.getElementById("humidity").textContent = data.main.humidity + "%";
        document.getElementById("wind").textContent = data.wind.speed + " m/s";
    }

    function displayForecast(data) {
        const forecast = data.list;

        const timeSlots = {
            morning: "06:00:00",
            afternoon: "12:00:00",
            evening: "18:00:00",
            night: "00:00:00"
        };

        const todayForecast = {
            morning: forecast.find(entry => entry.dt_txt.includes(timeSlots.morning)),
            afternoon: forecast.find(entry => entry.dt_txt.includes(timeSlots.afternoon)),
            evening: forecast.find(entry => entry.dt_txt.includes(timeSlots.evening)),
            night: forecast.find(entry => entry.dt_txt.includes(timeSlots.night))
        };

        displayTodayForecast(todayForecast);
        displayFiveDayForecast(forecast);
    }

    function displayTodayForecast(todayForecast) {
        document.getElementById("morning-temp").textContent = todayForecast.morning.main.temp + "°C";
        document.getElementById("morning-condition").textContent = todayForecast.morning.weather[0].description;
        document.getElementById("morning-img").src = `https://openweathermap.org/img/wn/${todayForecast.morning.weather[0].icon}@2x.png`;

        document.getElementById("afternoon-temp").textContent = todayForecast.afternoon.main.temp + "°C";
        document.getElementById("afternoon-condition").textContent = todayForecast.afternoon.weather[0].description;
        document.getElementById("afternoon-img").src = `https://openweathermap.org/img/wn/${todayForecast.afternoon.weather[0].icon}@2x.png`;

        document.getElementById("evening-temp").textContent = todayForecast.evening.main.temp + "°C";
        document.getElementById("evening-condition").textContent = todayForecast.evening.weather[0].description;
        document.getElementById("evening-img").src = `https://openweathermap.org/img/wn/${todayForecast.evening.weather[0].icon}@2x.png`;

        document.getElementById("night-temp").textContent = todayForecast.night.main.temp + "°C";
        document.getElementById("night-condition").textContent = todayForecast.night.weather[0].description;
        document.getElementById("night-img").src = `https://openweathermap.org/img/wn/${todayForecast.night.weather[0].icon}@2x.png`;
    }

    function displayFiveDayForecast(forecast) {
    const days = forecast.filter(entry => entry.dt_txt.includes("12:00:00"));

    const day1 = days[0];
    const date1 = new Date(day1.dt_txt);
    document.getElementById("date1").textContent = date1.toDateString();
    document.getElementById("day1").textContent = date1.toLocaleDateString('en-US', { weekday: 'long' });
    document.getElementById("day1-temp").textContent = day1.main.temp + "°C";
    document.getElementById("day1-condition").textContent = day1.weather[0].description;
    document.getElementById("day1-img").src = `https://openweathermap.org/img/wn/${day1.weather[0].icon}@2x.png`;

    const day2 = days[1];
    const date2 = new Date(day2.dt_txt);
    document.getElementById("date2").textContent = date2.toDateString();
    document.getElementById("day2").textContent = date2.toLocaleDateString('en-US', { weekday: 'long' });
    document.getElementById("day2-temp").textContent = day2.main.temp + "°C";
    document.getElementById("day2-condition").textContent = day2.weather[0].description;
    document.getElementById("day2-img").src = `https://openweathermap.org/img/wn/${day2.weather[0].icon}@2x.png`;

    const day3 = days[2];
    const date3 = new Date(day3.dt_txt);
    document.getElementById("date3").textContent = date3.toDateString();
    document.getElementById("day3").textContent = date3.toLocaleDateString('en-US', { weekday: 'long' });
    document.getElementById("day3-temp").textContent = day3.main.temp + "°C";
    document.getElementById("day3-condition").textContent = day3.weather[0].description;
    document.getElementById("day3-img").src = `https://openweathermap.org/img/wn/${day3.weather[0].icon}@2x.png`;

    const day4 = days[3];
    const date4 = new Date(day4.dt_txt);
    document.getElementById("date4").textContent = date4.toDateString();
    document.getElementById("day4").textContent = date4.toLocaleDateString('en-US', { weekday: 'long' });
    document.getElementById("day4-temp").textContent = day4.main.temp + "°C";
    document.getElementById("day4-condition").textContent = day4.weather[0].description;
    document.getElementById("day4-img").src = `https://openweathermap.org/img/wn/${day4.weather[0].icon}@2x.png`;

    const day5 = days[4];
    const date5 = new Date(day5.dt_txt);
    document.getElementById("date5").textContent = date5.toDateString();
    document.getElementById("day5").textContent = date5.toLocaleDateString('en-US', { weekday: 'long' });
    document.getElementById("day5-temp").textContent = day5.main.temp + "°C";
    document.getElementById("day5-condition").textContent = day5.weather[0].description;
    document.getElementById("day5-img").src = `https://openweathermap.org/img/wn/${day5.weather[0].icon}@2x.png`;
}

});
