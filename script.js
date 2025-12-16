// CONFIG   
const API_KEY = "c62c79ea6988def57c1cd62384db73d4";
const WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather";
const FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast";

// DOM ELEMENTS   Mayuri

const DOM = {
    searchBtn: document.getElementById("searchBtn"),
    cityInput: document.getElementById("cityInput"),
    weatherBox: document.getElementById("weatherBox"),
    cityName: document.getElementById("cityName"),
    weatherIcon: document.getElementById("weatherIcon"),
    temperature: document.getElementById("temperature"),
    humidity: document.getElementById("humidity"),
    wind: document.getElementById("wind"),
    condition: document.getElementById("condition"),
    errorMsg: document.getElementById("errorMsg"),
    favBtn: document.getElementById("favBtn"),
    favList: document.getElementById("favList"),
    forecastBox: document.getElementById("forecastBox"),
    forecastContainer: document.getElementById("forecastContainer"),
    body: document.body
};

// UTILITIES    

const showError = (msg) => {
    DOM.errorMsg.textContent = `❌ ${msg}`;
    DOM.weatherBox.classList.add("hidden");
    DOM.forecastBox.classList.add("hidden");
};

const clearError = () => {
    DOM.errorMsg.textContent = "";
};

const saveFavorites = (favorites) => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
};

const loadFavoritesFromStorage = () => {
    return JSON.parse(localStorage.getItem("favorites")) || [];
};
// WEATHER FUNCTIONS 

const getWeather = async (city) => {
    if (!city) return;

    clearError();
    DOM.weatherBox.classList.add("hidden");
    DOM.forecastBox.classList.add("hidden");
    DOM.errorMsg.textContent = "Loading...";

    try {
        // Current weather
        const resWeather = await fetch(`${WEATHER_URL}?q=${encodeURIComponent(city)},SE&units=metric&appid=${API_KEY}`);
        if (!resWeather.ok) {
            if (resWeather.status === 404) throw new Error(`City "${city}" not found`);
            if (resWeather.status === 401) throw new Error("Invalid API key");
            throw new Error("Server error, please try again later");
        }
        const dataWeather = await resWeather.json();
        displayWeather(dataWeather);

        // 3-day forecast
        const resForecast = await fetch(`${FORECAST_URL}?q=${encodeURIComponent(city)},SE&units=metric&appid=${API_KEY}`);
        if (!resForecast.ok) throw new Error("Forecast not available");
        const dataForecast = await resForecast.json();
        displayForecast(dataForecast);

    } catch (err) {
        showError(err.message);
    }
};

const displayWeather = (data) => {
    DOM.cityName.textContent = data.name;

    // Round numbers for better readability
    const temp = Math.round(data.main.temp);
    const humidity = data.main.humidity;
    const windSpeed = Math.round(data.wind.speed);
    const condition = data.weather[0].description;

    // Capitalize condition
    const formattedCondition = condition
        .split(' ')
        .map(word => word[0].toUpperCase() + word.slice(1))
        .join(' ');

    DOM.temperature.textContent = `Temperature: ${temp}°C`;
    DOM.humidity.textContent = `Humidity: ${humidity}%`;
    DOM.wind.textContent = `Wind: ${windSpeed} m/s`;
    DOM.condition.textContent = `Condition: ${formattedCondition}`;

    const iconCode = data.weather[0].icon;
    DOM.weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    DOM.weatherIcon.alt = formattedCondition;

    setBackground(data.weather[0].main);

    DOM.weatherBox.classList.remove("hidden");
    clearError();
};

// =====================
// FAVORITES FUNCTIONS       Suneetha
// =====================
const addToFavorites = (city) => {
    if (!city) return;
    const favorites = loadFavoritesFromStorage();
    if (!favorites.includes(city)) {
        favorites.push(city);
        saveFavorites(favorites);
        renderFavorites();
    }
};

const removeFromFavorites = (city) => {
    let favorites = loadFavoritesFromStorage();
    favorites = favorites.filter(c => c !== city);
    saveFavorites(favorites);
    renderFavorites();
};

// EVENT LISTENERS

DOM.searchBtn.addEventListener("click", () => getWeather(DOM.cityInput.value.trim()));
DOM.cityInput.addEventListener("keypress", (e) => { if (e.key === "Enter") DOM.searchBtn.click(); });