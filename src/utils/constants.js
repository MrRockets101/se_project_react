const APIKey = "e955bdfb0e38c1bba3f002b386abe0ce";

function getWeatherApiUrl(latitude, longitude) {
  return `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=imperial&appid=${APIKey}`;
}

const IpAPIKey = "f4e039cced363b";

// Your backend API URL
const BASE_URL = "http://localhost:3001";

export { APIKey, getWeatherApiUrl, IpAPIKey, BASE_URL };
