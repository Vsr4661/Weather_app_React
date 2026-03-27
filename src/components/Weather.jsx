import { useState, useEffect } from "react";
import Search from "./search";

function Weather() {

  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);

  const [locationWeather, setLocationWeather] = useState(null);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_KEY = "fcd1efbab46d3d3b85d3fe79e1797953"; 

  /* ===============================
     SEARCH WEATHER FUNCTION
  =============================== */

  const fetchWeather = async (cityName) => {

    setLoading(true);

    try {

      // Current Weather
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      );

      const weatherData =
        await weatherResponse.json();

      // Forecast
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=metric`
      );

      const forecastData =
        await forecastResponse.json();

      const dailyForecast =
        forecastData.list.filter(
          (item, index) =>
            index % 8 === 0
        );

      setWeather(weatherData);
      setForecast(dailyForecast);

    } catch {

      setError("Failed to fetch weather");

    } finally {

      setLoading(false);

    }
  };

  /* ===============================
     CURRENT LOCATION WEATHER
  =============================== */

  useEffect(() => {

    navigator.geolocation.getCurrentPosition(
      async (position) => {

        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );

        const data = await response.json();

        setLocationWeather(data);

      }
    );

  }, []);

  return (

    <div className="main-layout">

      {/* LEFT SIDE */}

      <div className="weather-app">

        <h1>🌤️ Weather</h1>

        <Search onSearch={fetchWeather} />

        {loading && <p>Loading...</p>}

        {error && (
          <p className="error">
            {error}
          </p>
        )}

        {/* Search Weather */}

        {weather && (

          <div className="weather-info">

            <h2>{weather.name}</h2>

            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt="icon"
            />

            <p>
              {Math.round(weather.main.temp)}°
            </p>

            <p>
              {weather.weather[0].main}
            </p>

          </div>

        )}

        {/* Forecast */}

        {forecast.length > 0 && (

          <div className="forecast-container">

            {forecast.map(
              (day, index) => (

                <div
                  key={index}
                  className="forecast-card"
                >

                  <p>

                    {new Date(
                      day.dt_txt
                    ).toLocaleDateString(
                      "en-US",
                      {
                        weekday: "short"
                      }
                    )}

                  </p>

                  <img
                    src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                    alt="forecast"
                  />

                  <p>
                    {Math.round(day.main.temp)}°
                  </p>

                </div>

              )
            )}

          </div>

        )}

      </div>

      {/* RIGHT SIDE */}

      <div className="location-card">

        <h2>📍 Your Location</h2>

        {locationWeather && (

          <div>

            <h3>
              {locationWeather.name}
            </h3>

            <img
              src={`https://openweathermap.org/img/wn/${locationWeather.weather[0].icon}@2x.png`}
              alt="location"
            />

            <p>
              {Math.round(locationWeather.main.temp)}°
            </p>

            <p>
              {locationWeather.weather[0].main}
            </p>

          </div>

        )}

      </div>

    </div>

  );

}

export default Weather;