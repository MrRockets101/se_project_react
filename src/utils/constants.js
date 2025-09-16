const APIKey = "e955bdfb0e38c1bba3f002b386abe0ce";

function getWeatherApiUrl(latitude, longitude) {
  return `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=imperial&appid=${APIKey}`;
}

// https://ipinfo.io/dashboard/lite curl https://api.ipinfo.io/lite/8.8.8.8?token=f4e039cced363b

const IpAPIKey = "f4e039cced363b";
export { APIKey, getWeatherApiUrl, IpAPIKey };
