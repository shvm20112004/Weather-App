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
            .then(response => response.json())
            .then(data => displayCurrentWeather(data))
            .catch(error => console.error('Error fetching weather data:', error));
    }

    function fetchWeatherDataByCoordinates(lat, lon) {
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
            .then(response => response.json())
            .then(data => displayCurrentWeather(data))
            .catch(error => console.error('Error fetching weather data:', error));
    }

    function fetchForecastData(city) {
        fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`)
            .then(response => response.json())
            .then(data => displayForecast(data))
            .catch(error => console.error('Error fetching forecast data:', error));
    }

    function fetchForecastDataByCoordinates(lat, lon) {
        fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
            .then(response => response.json())
            .then(data => displayForecast(data))
            .catch(error => console.error('Error fetching forecast data:', error));
    }

    function displayCurrentWeather(data) {
        document.getElementById("temp").textContent = `${data.main.temp}°C`;
        document.getElementById("current-condition").textContent = data.weather[0].description;
        document.getElementById("location").textContent = data.name;
        document.getElementById("current-img").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

        document.getElementById("sunrise-time").textContent = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
        document.getElementById("sunset-time").textContent = new Date(data.sys.sunset * 1000).toLocaleTimeString();
        document.getElementById("precipitation").textContent = `${data.rain ? data.rain["1h"] : 0} mm`;
        document.getElementById("humidity").textContent = `${data.main.humidity}%`;
        document.getElementById("wind").textContent = `${data.wind.speed} m/s`;
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
        document.getElementById("morning-temp").textContent = `${todayForecast.morning.main.temp}°C`;
        document.getElementById("morning-condition").textContent = todayForecast.morning.weather[0].description;
        document.getElementById("morning-img").src = `https://openweathermap.org/img/wn/${todayForecast.morning.weather[0].icon}@2x.png`;

        document.getElementById("afternoon-temp").textContent = `${todayForecast.afternoon.main.temp}°C`;
        document.getElementById("afternoon-condition").textContent = todayForecast.afternoon.weather[0].description;
        document.getElementById("afternoon-img").src = `https://openweathermap.org/img/wn/${todayForecast.afternoon.weather[0].icon}@2x.png`;

        document.getElementById("evening-temp").textContent = `${todayForecast.evening.main.temp}°C`;
        document.getElementById("evening-condition").textContent = todayForecast.evening.weather[0].description;
        document.getElementById("evening-img").src = `https://openweathermap.org/img/wn/${todayForecast.evening.weather[0].icon}@2x.png`;

        document.getElementById("night-temp").textContent = `${todayForecast.night.main.temp}°C`;
        document.getElementById("night-condition").textContent = todayForecast.night.weather[0].description;
        document.getElementById("night-img").src = `https://openweathermap.org/img/wn/${todayForecast.night.weather[0].icon}@2x.png`;
    }

    function displayFiveDayForecast(forecast) {
        const days = forecast.filter(entry => entry.dt_txt.includes("12:00:00"));
        for (let i = 0; i < 5; i++) {
            const day = days[i];
            const date = new Date(day.dt_txt);
            const dayIndex = i + 1;
            document.getElementById(`date${dayIndex}`).textContent = date.toDateString();
            document.getElementById(`day${dayIndex}`).textContent = date.toLocaleDateString('en-US', { weekday: 'long' });
            document.getElementById(`day${dayIndex}-temp`).textContent = `${day.main.temp}°C`;
            document.getElementById(`day${dayIndex}-condition`).textContent = day.weather[0].description;
            document.getElementById(`day${dayIndex}-img`).src = `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;
        }
    }
});
