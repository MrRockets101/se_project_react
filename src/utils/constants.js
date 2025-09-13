const APIKey = "e955bdfb0e38c1bba3f002b386abe0ce";

function getWeatherApiUrl(latitude, longitude) {
  return `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=imperial&appid=${APIKey}`;
}

export { APIKey, getWeatherApiUrl };
