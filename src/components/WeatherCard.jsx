import cloudy from "../images/Day-Cloudy.png";
import "../blocks/Index.css";
import { useContext } from "react";
import CurrentTemperatureUnitContext from "./CurrentTemperatureUnitContext";

function WeatherCard({ weatherData }) {
  const { currentTempUnit } = useContext(CurrentTemperatureUnitContext);

  return (
    <section className="weatherCard">
      <img src={cloudy} alt="Cloudy Weather" className="weatherCard__image" />
      <p className="weatherCard__temperature">
        {weatherData.temp[currentTempUnit]}&deg; {currentTempUnit}
      </p>
    </section>
  );
}

export default WeatherCard;
