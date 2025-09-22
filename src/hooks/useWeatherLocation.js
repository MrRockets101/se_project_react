import { useState, useEffect, useCallback } from "react";
import { getWeatherData } from "../utils/weatherApi";
import { IpAPIKey } from "../utils/constants";

const DEFAULT_COORDS = { latitude: 40.7128, longitude: -74.006 }; // NYC fallback

async function getClientIpGeolocation() {
  const response = await fetch(`https://ipinfo.io/json?token=${IpAPIKey}`);
  if (!response.ok) {
    throw new Error("Failed to get client IP geolocation");
  }

  const data = await response.json();
  console.log("IP Info client data:", data); // <-- DEBUG LOG

  if (!data.loc) {
    throw new Error("Location data missing in IP info response");
  }

  const [latitude, longitude] = data.loc.split(",");
  return {
    latitude: parseFloat(latitude),
    longitude: parseFloat(longitude),
  };
}

async function getServerIpGeolocation() {
  const response = await fetch(`https://ipinfo.io/json?token=${IpAPIKey}`);
  if (!response.ok) {
    throw new Error("Failed to get server IP geolocation");
  }

  const data = await response.json();

  if (!data.loc) {
    throw new Error("Location data missing in IP info response");
  }

  const [latitude, longitude] = data.loc.split(",");
  return {
    latitude: parseFloat(latitude),
    longitude: parseFloat(longitude),
  };
}

export function useWeatherLocation() {
  const [weatherData, setWeatherData] = useState(null);
  const [apiWeatherError, setApiWeatherError] = useState(null);
  const [apiLocationError, setApiLocationError] = useState(null);

  const fetchWeather = useCallback(async ({ latitude, longitude }) => {
    try {
      console.log("Fetching weather for:", latitude, longitude);
      const data = await getWeatherData(latitude, longitude);
      console.log("Weather data received:", data);
      setWeatherData(data);
      setApiWeatherError(null);
    } catch (error) {
      setApiWeatherError(error.message || "Failed to fetch weather data");
    }
  }, []);

  const detectIpLocation = useCallback(async () => {
    try {
      const ipCoords = await getClientIpGeolocation();
      setApiLocationError(null);
      await fetchWeather(ipCoords);
      return ipCoords;
    } catch {
      try {
        const serverCoords = await getServerIpGeolocation();
        setApiLocationError(null);
        await fetchWeather(serverCoords);
        return serverCoords;
      } catch {
        setApiLocationError("Failed to detect location via IP");
        await fetchWeather(DEFAULT_COORDS);
        return DEFAULT_COORDS;
      }
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
