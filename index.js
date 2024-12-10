document.addEventListener('DOMContentLoaded', () => {
    const apiKey = 'ef3a2e8e3d8ec6b48307cbcebbc05e52';
    const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
    const forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast';

    const searchBtn = document.getElementById('search-btn');
    const cityInput = document.getElementById('city-input');
    const tempSelect = document.getElementById('temp-select');
    const darkModeBtn = document.getElementById('dark-mode-btn');
    const cityName = document.getElementById('city-name');
    const weatherIcon = document.getElementById('weather-icon');
    const temperature = document.getElementById('temperature');
    const condition = document.getElementById('condition');
    const humidity = document.getElementById('humidity');
    const windSpeed = document.getElementById('wind-speed');
    const localTime = document.getElementById('local-time');
    const forecastDetails = document.getElementById('forecast-details');
    const hourlyForecastElement = document.getElementById('hourly-details');
    const background = document.getElementById('background');
    const languageSelect = document.getElementById('language-select');

    let isCelsius = true;
    let currentTempC = 0;
    let language = 'en'; // Default language

    searchBtn.addEventListener('click', () => {
        const city = cityInput.value.trim();
        if (city) {
            fetchWeatherData(city);
        } else {
            alert('Please enter a city name');
        }
    });

    tempSelect.addEventListener('change', () => {
        isCelsius = tempSelect.value === 'celsius';
        updateTemperatureDisplay();
    });

    darkModeBtn.addEventListener('click', () => {
        document.body.classList.toggle("dark-mode");
        document.body.classList.toggle("light-mode");
        tempSelect.classList.toggle("dark-mode");
    });

    languageSelect.addEventListener('change', () => {
        language = languageSelect.value;
        updateLanguage();
        const city = cityInput.value.trim();
        if (city) {
            fetchWeatherData(city);
        }
    });

    const fetchWeatherData = async (city) => {
        try {
            const response = await fetch(`${apiUrl}?q=${city}&appid=${apiKey}&units=metric&lang=${language}`);
            const data = await response.json();
            if (data.cod === 200) {
                displayWeatherData(data);
                fetchForecastData(city);
            } else {
                alert('City not found');
            }
        } catch (error) {
            alert('Error fetching weather data');
            console.error(error);
        }
    };

    const fetchForecastData = async (city) => {
        try {
            const response = await fetch(`${forecastUrl}?q=${city}&appid=${apiKey}&units=metric&lang=${language}`);
            const data = await response.json();
            displayForecastData(data);
            displayHourlyForecast(data);
        } catch (error) {
            alert('Error fetching forecast data');
            console.error(error);
        }
    };

    const displayWeatherData = (data) => {
        const weather = data.weather[0];
        currentTempC = data.main.temp;
        const icon = `https://openweathermap.org/img/wn/${weather.icon}@2x.png`;

        cityName.textContent = data.name;
        updateTemperatureDisplay();
        condition.textContent = weather.description;
        humidity.textContent = `Humidity: ${data.main.humidity}%`;
        windSpeed.textContent = `Wind Speed: ${data.wind.speed} m/s`;
        weatherIcon.innerHTML = `<img src="${icon}" alt="${weather.description}">`;

        updateBackground(weather.main);
        updateLocalTime(data.timezone);
    };

    const updateTemperatureDisplay = () => {
        if (isCelsius) {
            temperature.textContent = `${currentTempC.toFixed(1)}°C`;
        } else {
            const tempF = (currentTempC * 9 / 5) + 32;
            temperature.textContent = `${tempF.toFixed(1)}°F`;
        }
    };

    const displayForecastData = (data) => {
        forecastDetails.innerHTML = '<p>5-Day Forecast</p>';
        const dailyData = data.list.filter((item) => item.dt_txt.includes('12:00:00'));
        dailyData.forEach((day) => {
            const date = new Date(day.dt_txt);
            const icon = `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;
            const tempC = day.main.temp;
            const tempF = (tempC * 9 / 5) + 32;
            const description = day.weather[0].description;

            const forecastItem = document.createElement('div');
            forecastItem.classList.add('weather-forecast-item');
            forecastItem.innerHTML = `
                <div class="forecast-date">${date.toDateString()}</div>
                <div class="forecast-icon"><img src="${icon}" alt="${description}"></div>
                <div class="forecast-temp">${isCelsius ? tempC.toFixed(1) + '°C' : tempF.toFixed(1) + '°F'}</div>
                <div class="forecast-condition">${description}</div>
            `;
            forecastDetails.appendChild(forecastItem);
        });
    };

    const displayHourlyForecast = (data) => {
        hourlyForecastElement.innerHTML = '<p>Hourly Forecast</p>';
        const hourlyData = data.list.slice(0, 12); // Display next 12 hours
        hourlyData.forEach((hour) => {
            const time = new Date(hour.dt_txt).getHours();
            const icon = `https://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png`;
            const tempC = hour.main.temp;
            const tempF = (tempC * 9 / 5) + 32;
            const description = hour.weather[0].description;

            const hourItem = document.createElement('div');
            hourItem.classList.add('weather-hourly-item');
            hourItem.innerHTML = `
                <div class="forecast-time">${time}:00</div>
                <div class="forecast-icon"><img src="${icon}" alt="${description}"></div>
                <div class="forecast-temp">${isCelsius ? tempC.toFixed(1) + '°C' : tempF.toFixed(1) + '°F'}</div>
                <div class="forecast-condition">${description}</div>
            `;
            hourlyForecastElement.appendChild(hourItem);
        });
    };

    const updateBackground = (weatherCondition) => {
        let condition = weatherCondition.toLowerCase();
        let bg;

        if (condition.includes('clear'))
            bg = "url('images/clear.jpeg')";
        else if (condition.includes('cloud'))
            bg = "url('images/clouds.jpeg')";
        else if (condition.includes('rain'))
            bg = "url('images/rain.jpeg')";
        else if (condition.includes('snow'))
            bg = "url('images/snow.jpeg')";
        else if (condition.includes('thunder'))
            bg = "url('images/thunderstorm.jpeg')";
        else
            bg = "url('images/default.jpg')";

        background.style.backgroundImage = bg
    }




    const updateLocalTime = (timezone) => {
        const now = new Date();
        const localTimeOffset = now.getTimezoneOffset();
        const cityTime = new Date(now.getTime() + timezone * 1000 + localTimeOffset * 60 * 1000);
        localTime.textContent = `Local Time: ${cityTime.getHours()}:${cityTime.getMinutes() < 10 ? '0' : ''}${cityTime.getMinutes()}`;
    };

    // Multi-Language functionality
    const updateLanguage = () => {
        const langFile = `lang/${language}.json`;
        fetch(langFile)
            .then(response => response.json())
            .then(data => {
                // Update UI elements with new language
                document.getElementById('app-title').textContent = data.title;
                document.getElementById('search-btn').textContent = data.searchButton;
                document.getElementById('dark-mode-btn').textContent = data.darkModeButton;
                document.getElementById('forecast-title').textContent = data.forecastTitle;
                document.getElementById('hourly-title').textContent = data.hourlyTitle;
                // Add other UI elements as needed
            })
            .catch(error => console.error('Error loading language file:', error));
    };

    // Initialize language selection
    updateLanguage();
});
