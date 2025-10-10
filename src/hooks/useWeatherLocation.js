import { useState, useEffect, useCallback } from "react";
import { parseWeatherData } from "../utils/weatherApi"; // Import the parsing function
import { BASE_URL } from "../utils/constants";
const DEFAULT_COORDS = { latitude: 40.7128, longitude: -74.006 }; // NYC fallback
const BACKEND_WEATHER_URL = BASE_URL + "/api/weather"; // proxy route on backend

async function getClientIpGeolocation() {
  const response = await fetch(`https://ipinfo.io/json?token=f4e039cced363b`);
  if (!response.ok) throw new Error("Failed to get client IP geolocation");
  const data = await response.json();
  console.log("IP Info client data:", data);

  if (!data.loc) throw new Error("Location data missing in IP info response");
  const [latitude, longitude] = data.loc.split(",");
  return { latitude: parseFloat(latitude), longitude: parseFloat(longitude) };
}

export function useWeatherLocation() {
  const [weatherData, setWeatherData] = useState(null);
  const [apiWeatherError, setApiWeatherError] = useState(null);
  const [apiLocationError, setApiLocationError] = useState(null);

  const fetchWeather = useCallback(async ({ latitude, longitude }) => {
    try {
      console.log("Fetching weather for:", latitude, longitude);

      const res = await fetch(
        `${BACKEND_WEATHER_URL}?lat=${latitude}&lon=${longitude}`
      );
      if (!res.ok) throw new Error(`Weather fetch failed: ${res.status}`);
      let data = await res.json();

      // If backend does not return a name, use default coordinates
      if (!data.name) {
        console.warn("No city name returned, using default coordinates");
        const defaultRes = await fetch(
          `${BACKEND_WEATHER_URL}?lat=${DEFAULT_COORDS.latitude}&lon=${DEFAULT_COORDS.longitude}`
        );
        if (!defaultRes.ok)
          throw new Error(`Weather fetch failed: ${defaultRes.status}`);
        data = await defaultRes.json();
        // Ensure name is set for default
        data.name = data.name || "New York";
      }

      console.log("Weather data received:", data);
      const parsedData = parseWeatherData(data); // Parse the raw data
      console.log("Parsed weather data:", parsedData); // Log parsed data for verification
      setWeatherData(parsedData); // Set the parsed data
      setApiWeatherError(null);
    } catch (err) {
      setApiWeatherError(err.message || "Failed to fetch weather data");
    }
  }, []);

  const detectIpLocation = useCallback(async () => {
    try {
      const coords = await getClientIpGeolocation();
      setApiLocationError(null);
      await fetchWeather(coords);
      return coords;
    } catch (err) {
      console.warn("IP geolocation failed, using default coords", err);
      setApiLocationError("Failed to detect location via IP");
      await fetchWeather(DEFAULT_COORDS);
      return DEFAULT_COORDS;
    }
  }, [fetchWeather]);

  const updateLocation = useCallback(
    async ({ latitude, longitude }) => {
      await fetchWeather({ latitude, longitude });
    },
    [fetchWeather]
  );

  useEffect(() => {
    detectIpLocation();
  }, [detectIpLocation]);

  return {
    weatherData,
    apiWeatherError,
    apiLocationError,
    updateLocation,
    detectIpLocation,
    setApiLocationError,
  };
}
