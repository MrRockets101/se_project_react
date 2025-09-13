import { getWeatherApiUrl } from "./constants";

export function getWeatherData(latitude, longitude) {
  const weatherApiUrl = getWeatherApiUrl(latitude, longitude);
  return fetch(weatherApiUrl)
    .then((res) => {
      res.ok
        ? res.json()
        : Promise.reject(`Error from weather API: ${res.status}`);
    })
    .then((data) => {
      return parseWeatherData(data);
    });
}

function parseWeatherData(data) {
  const parsedData = { temp: {} };

  parsedData.city = data.name;
  parsedData.temp.F = Math.round(data.main.temp);
  parsedData.temp.C = Math.round(((data.main.temp - 32) * 5) / 9);

  return parsedData;
}
