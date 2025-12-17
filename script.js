// CONFIG   
const API_KEY = "c62c79ea6988def57c1cd62384db73d4";
const WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather";
const FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast";

// DOM ELEMENTS   

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


const displayForecast = (data) => {
    DOM.forecastContainer.innerHTML = "";
    DOM.forecastBox.classList.remove("hidden");

    // Filter next 3 days, taking forecast at 12:00 each day
    const forecastMap = {};
    data.list.forEach(item => {
        const date = item.dt_txt.split(" ")[0];
        const time = item.dt_txt.split(" ")[1];
        if (!forecastMap[date] && time === "12:00:00") {
            forecastMap[date] = item;
        }
    });

    const next3Days = Object.values(forecastMap).slice(0, 3);
    next3Days.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("forecast-card");

        const date = new Date(item.dt_txt);
        const day = date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });

        const icon = document.createElement("img");
        icon.src = `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`;
        icon.alt = item.weather[0].description;

        const temp = document.createElement("p");
        temp.textContent = `🌡 ${item.main.temp}°C`;

        const cond = document.createElement("p");
        cond.textContent = item.weather[0].description;

        const dayEl = document.createElement("p");
        dayEl.textContent = day;

        card.appendChild(dayEl);
        card.appendChild(icon);
        card.appendChild(temp);
        card.appendChild(cond);

        DOM.forecastContainer.appendChild(card);
    });
};
// FAVORITES FUNCTIONS   

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

const renderFavorites = () => {
    const favorites = loadFavoritesFromStorage();
    DOM.favList.innerHTML = "";

    favorites.forEach(city => {
        const li = document.createElement("li");
        li.classList.add("fav-item");

        const span = document.createElement("span");
        span.textContent = city;

        const btnContainer = document.createElement("div");
        btnContainer.classList.add("fav-buttons");

        const viewBtn = document.createElement("button");
        viewBtn.textContent = "View";
        viewBtn.classList.add("view-btn");
        viewBtn.addEventListener("click", () => getWeather(city));

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "X";
        deleteBtn.classList.add("delete-btn");
        deleteBtn.addEventListener("click", () => removeFromFavorites(city));

        btnContainer.appendChild(viewBtn);
        btnContainer.appendChild(deleteBtn);

        li.appendChild(span);
        li.appendChild(btnContainer);

        DOM.favList.appendChild(li);
    });
};


// BACKGROUND    

const setBackground = (weather) => {
    switch (weather.toLowerCase()) {
        case "clear": DOM.body.style.background = "linear-gradient(to bottom, #fceabb, #f8b500)"; break;
        case "clouds": DOM.body.style.background = "linear-gradient(to bottom, #bdc3c7, #2c3e50)"; break;
        case "rain":
        case "drizzle": DOM.body.style.background = "linear-gradient(to bottom, #74ebd5, #ACB6E5)"; break;
        case "thunderstorm": DOM.body.style.background = "linear-gradient(to bottom, #373B44, #4286f4)"; break;
        case "snow": DOM.body.style.background = "linear-gradient(to bottom, #e0eafc, #cfdef3)"; break;
        default: DOM.body.style.background = "linear-gradient(to bottom, #87ceeb, #f0f4f8)";
    }
};
 

// EVENT LISTENERS

DOM.searchBtn.addEventListener("click", () => getWeather(DOM.cityInput.value.trim()));
DOM.cityInput.addEventListener("keypress", (e) => { if (e.key === "Enter") DOM.searchBtn.click(); });
DOM.favBtn.addEventListener("click", () => addToFavorites(DOM.cityName.textContent));
document.addEventListener("DOMContentLoaded", renderFavorites);  
