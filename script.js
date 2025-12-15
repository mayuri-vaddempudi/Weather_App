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
