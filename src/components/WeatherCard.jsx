import "../blocks/Index.css";
import { useContext } from "react";
import CurrentTemperatureUnitContext from "./CurrentTemperatureUnitContext";

import { weatherImages } from "../utils/weatherImages";

function WeatherCard({ weatherData, apiWeatherError }) {
  const { currentTempUnit } = useContext(CurrentTemperatureUnitContext);

  const { condition = "clear", timeOfDay = "day" } = weatherData;

  const weatherImage =
    weatherImages[timeOfDay]?.[condition] || weatherImages.day.clear;

  return (
    <section className="weatherCard">
      <img
        src={weatherImage}
        alt={`${timeOfDay} ${condition}`}
        className="weatherCard__image"
      />
      <p
        className={`weatherCard__temperature ${apiWeatherError ? "error" : ""}`}
      >
        {apiWeatherError
          ? `Weather error: ${apiWeatherError}`
          : `${weatherData.temp[currentTempUnit]}° ${currentTempUnit}`}
      </p>
    </section>
  );
}

export default WeatherCard;
