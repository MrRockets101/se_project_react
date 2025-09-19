import React, { useContext } from "react";
import WeatherCard from "./WeatherCard.jsx";
import ItemCard from "./ItemCard.jsx";
import CurrentTemperatureUnitContext from "../utils/CurrentTemperatureUnitContext.js";

function Main({
  clothingItems,
  handleOpenItemModal,
  weatherData,
  apiWeatherError,
}) {
  const { currentTempUnit } = useContext(CurrentTemperatureUnitContext);

  const temp = weatherData?.temp?.[currentTempUnit];

  return (
    <main className="main">
      <WeatherCard
        weatherData={weatherData}
        apiWeatherError={apiWeatherError}
      />
      <p className="main__text">
        Today is {temp}°{currentTempUnit} / You may want to wear:
      </p>
      <ul className="main__card-list">
        {clothingItems.map((item) => (
          <ItemCard
            key={item._id}
            data={item}
            onCardClick={handleOpenItemModal}
          />
        ))}
      </ul>
    </main>
  );
}

export default Main;
