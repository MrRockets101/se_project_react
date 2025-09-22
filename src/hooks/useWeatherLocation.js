import { useState, useEffect, useCallback } from "react";
import {
  getClientIpGeolocation,
  getServerIpGeolocation,
} from "../utils/ipGeolocation";
import { getWeatherData } from "../utils/weatherApi";

const DEFAULT_COORDS = {
  latitude: 46.226667,
  longitude: 6.140556,
  source: "default",
};

export function useWeatherLocation() {
  const [weatherData, setWeatherData] = useState({
    city: "Unknown",
    temp: { F: "--", C: "--" },
  });

  const [apiWeatherError, setApiWeatherError] = useState(null);
  const [apiLocationError, setApiLocationError] = useState(null);

  const fetchWeather = useCallback(async (coords) => {
    try {
      const data = await getWeatherData(coords.latitude, coords.longitude);
      setWeatherData(data);
      setApiWeatherError(null);

      if (data.city && data.city !== "Unknown") {
        setApiLocationError(null);
      }
    } catch (error) {
      console.error("Weather fetch error:", error);
      setApiWeatherError("Failed to fetch weather for your location.");
    }
  }, []);

  const detectInitialLocation = useCallback(async () => {
    let coords = null;

    const tryNavigatorGeolocation = () =>
      new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error("Geolocation not supported"));
        } else {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              resolve({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                source: "navigator",
              });
            },
            (error) => reject(error)
          );
        }
      });

    try {
      coords = await tryNavigatorGeolocation();
      setApiLocationError(null);
    } catch (error) {
      setApiLocationError("For best accuracy, please enable browser location.");
      try {
        coords = await getClientIpGeolocation();
        setApiLocationError(null);
      } catch {
        try {
          coords = await getServerIpGeolocation();
          setApiLocationError(null);
        } catch {
          coords = DEFAULT_COORDS;
          setApiLocationError("Using default location");
        }
      }
    }

    await fetchWeather(coords);
  }, [fetchWeather]);

  useEffect(() => {
    detectInitialLocation();
  }, [detectInitialLocation]);

  const updateLocation = async ({ latitude, longitude }) => {
    await fetchWeather({ latitude, longitude });
  };

  return {
    weatherData,
    apiWeatherError,
    apiLocationError,
    updateLocation,
  };
}
