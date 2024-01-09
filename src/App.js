import "./App.css";
import { useState, useEffect } from "react";
import axios from "axios";

// due-point = T - (100 - RH)/5

function getDateWithTimeZoneOffset(offset) {
  const utcTime = new Date();
  const localTime = new Date(utcTime.getTime() + offset * 1000);
  const options = {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  const formattedTime = localTime.toLocaleString("en-US", options);
  return formattedTime;
}

function App() {
  const [search, setSearch] = useState("seoul");

  const [info, setInfo] = useState({
    city: "",
    country: "",
    weather: "",
    icon: "",
    weather_description: "",
    temperature: "",
    wind_speed: "",
    pressure: "",
    humidity: "",
    due_point: "",
    visibility: "",
  });
  const onSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };
  const fetchData = async () => {
    const API_KEY = process.env.REACT_APP_OPEN_WEATHER_API_KEY;
    const result = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${search}&appid=${API_KEY}&units=metric`
    );
    const data = result.data;

    setInfo({
      timezone: getDateWithTimeZoneOffset(parseInt(data.timezone)),
      city: data.name,
      country: data.sys.country,
      weather: data.weather[0].main,
      icon: data.weather[0].icon,
      weather_description: data.weather[0].description,
      temperature: data.main.temp,
      wind_speed: data.wind.speed,
      pressure: data.main.pressure,
      humidity: data.main.humidity,
      due_point: data.main.temp - (100 - parseInt(data.main.humidity)) / 5,
      visibility: data.visibility,
    });
  };
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <main>
      <div className="App">
        <section className="forecast">
          <p className="datetime">
            <strong>{info.timezone}</strong>
          </p>
          <p className="area">
            <strong>
              {info.city},{info.country}
            </strong>
          </p>
          <div className="temperature-container">
            <div className="weather-icon">
              <img
                alt="weather icon"
                src={`https://openweathermap.org/img/wn/${info.icon}.png`}
              ></img>
            </div>
            <div className="temperature">
              <strong>{Math.round(info.temperature)}°C</strong>
            </div>
            <div className="temperature-description">{info.description}</div>
          </div>
          <p className="summary">
            <strong>
              Feels like {info.temperature}°C. {info.weather}.{" "}
              {info.weather_description}
            </strong>
          </p>
          <div className="summary-container">
            <p className="wind">{info.wind_speed}m/s</p>
            <p className="pressure">{info.pressure}hPa</p>
            <br />
            <p className="humidity">Humidity: {info.humidity}</p>
            <p className="due-point">
              Dew_point: {Math.round(info.due_point)}°C
            </p>
            <p className="visibility">Visibility: {info.visibility}</p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default App;
