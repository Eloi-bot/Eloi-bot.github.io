document.addEventListener('DOMContentLoaded', function() {
    const apiKey = 'ef1b5869006346f2331bb755b0a31344'; // Replace with your OpenWeather API key
    const defaultCity = 'Lusaka';

    // Update time and date every second
    function updateTimeDate() {
        const now = new Date();
        const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
        const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

        document.getElementById('time').textContent = now.toLocaleTimeString('en-US', timeOptions);
        document.getElementById('date').textContent = now.toLocaleDateString('en-US', dateOptions);
    }

    setInterval(updateTimeDate, 1000);
    updateTimeDate(); // Initial call to display time and date immediately

    // Initial fetch to display weather for default city (Lusaka)
    fetchWeatherData(defaultCity);

    document.getElementById('search-btn').addEventListener('click', function() {
        const inputCity = document.getElementById('city-input').value.trim();
        if (inputCity) {
            fetchWeatherData(inputCity);
        } else {
            alert('Please enter a city name');
        }
    });

    document.getElementById('geolocation-btn').addEventListener('click', function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const { latitude, longitude } = position.coords;
                fetchWeatherByCoordinates(latitude, longitude);
            });
        } else {
            alert('Geolocation is not supported by this browser');
        }
    });

    function fetchWeatherData(city) {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
            .then(response => response.json())
            .then(data => {
                updateWeatherInfo(data);
                fetchWeatherForecast(data.coord.lat, data.coord.lon); // Fetch forecast using coordinates
            })
            .catch(error => console.error('Error fetching weather data:', error));
    }

    function fetchWeatherByCoordinates(latitude, longitude) {
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`)
            .then(response => response.json())
            .then(data => {
                updateWeatherInfo(data);
                fetchWeatherForecast(latitude, longitude); // Fetch forecast using coordinates
            })
            .catch(error => console.error('Error fetching weather data:', error));
    }

    function fetchWeatherForecast(latitude, longitude) {
        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely&appid=${apiKey}&units=metric`)
            .then(response => response.json())
            .then(data => {
                updateWeatherForecast(data);
            })
            .catch(error => console.error('Error fetching forecast data:', error));
    }

    function updateWeatherInfo(data) {
        // Current Weather Information
        document.getElementById('city-name').textContent = data.name;
        document.getElementById('temperature').textContent = `${data.main.temp} °C`;
        document.getElementById('weather-condition').textContent = data.weather[0].description;
        document.getElementById('humidity').textContent = `Humidity: ${data.main.humidity}%`;
        document.getElementById('wind-speed').textContent = `Wind Speed: ${data.wind.speed} m/s`;
        document.getElementById('weather-icon').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
    }

    function updateWeatherForecast(data) {
        if (!data || !data.hourly || !data.daily) {
            console.error('Invalid forecast data');
            return;
        }

        // Hourly Forecast
        const hourlyForecastContainer = document.getElementById('hourly-forecast');
        hourlyForecastContainer.innerHTML = ''; // Clear existing hourly forecast

        data.hourly.slice(0, 6).forEach(hour => {
            const hourElement = document.createElement('div');
            hourElement.classList.add('forecast-hour');
            const time = new Date(hour.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const temp = `${hour.temp} °C`;
            const condition = hour.weather[0].description;
            const humidity = `Humidity: ${hour.humidity}%`;
            const windSpeed = `Wind Speed: ${hour.wind_speed} m/s`;
            const iconUrl = `https://openweathermap.org/img/wn/${hour.weather[0].icon}.png`;

            hourElement.innerHTML = `
                <p>${time}</p>
                <img src="${iconUrl}" alt="Weather Icon">
                <p>${condition}</p>
                <p>${temp}</p>
                <p>${humidity}</p>
                <p>${windSpeed}</p>
            `;
            hourlyForecastContainer.appendChild(hourElement);
        });

        // Daily Forecast
        const dailyForecastContainer = document.getElementById('daily-forecast');
        dailyForecastContainer.innerHTML = ''; // Clear existing daily forecast

        data.daily.slice(0, 5).forEach(day => {
            const dayElement = document.createElement('div');
            dayElement.classList.add('forecast-day');
            const date = new Date(day.dt * 1000).toLocaleDateString();
            const temp = `${day.temp.day} °C`;
            const condition = day.weather[0].description;
            const humidity = `Humidity: ${day.humidity}%`;
            const windSpeed = `Wind Speed: ${day.wind_speed} m/s`;
            const iconUrl = `https://openweathermap.org/img/wn/${day.weather[0].icon}.png`;

            dayElement.innerHTML = `
                <p>${date}</p>
                <img src="${iconUrl}" alt="Weather Icon">
                <p>${condition}</p>
                <p>${temp}</p>
                <p>${humidity}</p>
                <p>${windSpeed}</p>
            `;
            dailyForecastContainer.appendChild(dayElement);
        });
    }
});
