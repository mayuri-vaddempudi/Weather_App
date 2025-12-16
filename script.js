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