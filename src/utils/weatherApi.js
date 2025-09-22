import { getWeatherApiUrl } from "./constants";
import { getWeatherCondition } from "./getWeatherCondition";
import { fetchJson } from "./fetchJson";

export function getWeatherData(latitude, longitude) {
  const url = getWeatherApiUrl(latitude, longitude);
  return fetchJson(url, {}, "Weather API error").then((data) => {
    console.log("Raw weather data:", data);
    return parseWeatherData(data);
  });
}
function parseWeatherData(data) {
  return {
    name: data.name || "Unknown location",
    temp: {
      F: data.main.temp,
      C: ((data.main.temp - 32) * 5) / 9,
    },
    weather: getWeatherCondition(data.weather[0]),
  };
}
