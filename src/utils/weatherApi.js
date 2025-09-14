import { getWeatherApiUrl } from "./constants";

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
  if (!data || !data.name || !data.main || typeof data.main.temp !== "number") {
    throw new Error("Invalid weather data structure");
  }

  const parsedData = { temp: {} };

  parsedData.city = data.name;
  parsedData.temp.F = Math.round(data.main.temp);
  parsedData.temp.C = Math.round(((data.main.temp - 32) * 5) / 9);

  return parsedData;
}
