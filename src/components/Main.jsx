import React, { useContext } from "react";
import WeatherCard from "./WeatherCard.jsx";
import ItemCard from "./ItemCard.jsx";
import CurrentTemperatureUnitContext from "./CurrentTemperatureUnitContext";
import { getTempCategory } from "../utils/getTempCategory";

function Main({ clothingItems, handleOpenItemModal, weatherData }) {
  const { currentTempUnit } = useContext(CurrentTemperatureUnitContext);

  const temp = weatherData?.temp?.[currentTempUnit];

  const tempCategory = getTempCategory(temp, currentTempUnit);

  const filteredItems = clothingItems.filter(
    (item) => item.weather?.toLowerCase() === tempCategory
  );

  console.log("TEMP:", temp);
  console.log("UNIT:", currentTempUnit);
  console.log("CATEGORY:", tempCategory);
  console.log(
    "MATCHING ITEMS:",
    filteredItems.map((i) => i.weather)
  );

  return (
    <main className="main">
      <WeatherCard weatherData={weatherData} />
      <p className="main__text">
        Today is a {tempCategory} {temp}°{currentTempUnit} / You may want to
        wear:
      </p>
      <ul className="main__card-list">
        {filteredItems.map((item) => (
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
