import { getWeatherApiUrl } from "./constants";

import { getWeatherCondition } from "./getWeatherCondition";

export function getWeatherData(latitude, longitude) {
  const weatherApiUrl = getWeatherApiUrl(latitude, longitude);
  return fetch(weatherApiUrl)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Weather API error: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      console.log("Raw weather data:", data);
      return parseWeatherData(data);
    });
}

function parseWeatherData(data) {
  if (
    !data ||
    !data.name ||
    !data.main ||
    typeof data.main.temp !== "number" ||
    !data.sys ||
    !data.weather ||
    !data.weather[0]
  ) {
    throw new Error("Invalid weather data structure");
  }

  const weatherCode = data.weather[0].id;
  const condition = getWeatherCondition(weatherCode);

  const currentTime = Math.floor((Date.now() / 1000) * 60);
  const sunriseMin = Math.floor(data.sys.sunrise / 60);
  const sunsetMin = Math.floor(data.sys.sunset / 60);
  const isDayTime =
    currentTime >= data.sys.sunrise && currentTime < data.sys.sunset;
  const timeOfDay = isDayTime ? "day" : "night";

  return {
    city: data.name,
    temp: {
      F: Math.round(data.main.temp),
      C: Math.round(((data.main.temp - 32) * 5) / 9),
    },
    weatherCode,
    condition,
    sunrise: data.sys.sunrise,
    sunset: data.sys.sunset,
    timeOfDay,
  };
}
