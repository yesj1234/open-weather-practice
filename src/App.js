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
    e.target.value = "";
  };
  const onChange = (e) => {
    console.log(e.target.value);
    setSearch(e.target.value);
    console.log(`search: ${search}`);
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
        <div id="section_container">
          <section className="search">
            <form
              className="search_form"
              method="get"
              id="searchForm"
              onSubmit={onSubmit}
            >
              <input
                type="text"
                name="city"
                placeholder="city name"
                value={search}
                onChange={onChange}
              />
              <button type="submit" htmlFor="city">
                Search
              </button>
            </form>
          </section>
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
              <div>
                <img
                  className="weather-icon"
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
              <p className="wind">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="16"
                  width="16"
                  viewBox="0 0 512 512"
                >
                  <path d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm306.7 69.1L162.4 380.6c-19.4 7.5-38.5-11.6-31-31l55.5-144.3c3.3-8.5 9.9-15.1 18.4-18.4l144.3-55.5c19.4-7.5 38.5 11.6 31 31L325.1 306.7c-3.2 8.5-9.9 15.1-18.4 18.4zM288 256a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z" />
                </svg>
                {info.wind_speed}m/s
              </p>
              <p className="pressure">
                <svg
                  data-v-7bdd0738=""
                  data-v-3208ab85=""
                  width="15pt"
                  height="15pt"
                  viewBox="0 0 96 96"
                  className="icon-pressure"
                >
                  <g
                    data-v-7bdd0738=""
                    transform="translate(0,96) scale(0.100000,-0.100000)"
                    fill="#48484a"
                    stroke="none"
                  >
                    <path
                      data-v-7bdd0738=""
                      d="M351 854 c-98 -35 -179 -108 -227 -202 -27 -53 -29 -65 -29 -172 0
    -107 2 -119 29 -172 38 -75 104 -141 180 -181 58 -31 66 -32 176 -32 110 0
    118 1 175 32 77 40 138 101 178 178 31 57 32 65 32 175 0 110 -1 118 -32 176
    -40 76 -106 142 -181 179 -49 25 -71 29 -157 32 -73 2 -112 -1 -144 -13z m259
    -80 c73 -34 126 -86 161 -159 24 -50 29 -73 29 -135 0 -62 -5 -85 -29 -135
    -57 -119 -161 -185 -291 -185 -130 0 -234 66 -291 185 -24 50 -29 73 -29 135
    0 130 66 234 185 291 82 40 184 41 265 3z"
                    ></path>
                    <path
                      data-v-7bdd0738=""
                      d="M545 600 c-35 -35 -68 -60 -80 -60 -27 0 -45 -18 -45 -45 0 -33 -50
    -75 -89 -75 -18 0 -41 -5 -53 -11 -20 -11 -20 -11 3 -35 12 -13 33 -24 46 -24
    17 0 23 -6 23 -23 0 -13 10 -33 23 -45 30 -28 47 -13 47 43 0 32 6 47 28 68
    15 15 37 27 48 27 26 0 44 18 44 44 0 12 26 47 60 81 l60 61 -28 27 -28 27
    -59 -60z"
                    ></path>
                  </g>
                </svg>
                {info.pressure}hPa
              </p>
              <br />
              <p className="humidity">Humidity: {info.humidity}</p>
              <p className="due-point">
                Dew_point: {Math.round(info.due_point)}°C
              </p>
              <p className="visibility">Visibility: {info.visibility}</p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default App;
