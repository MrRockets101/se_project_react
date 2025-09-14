import WeatherCard from "./WeatherCard.jsx";
import ItemCard from "./ItemCard.jsx";
import "../blocks/Index.css";
import { useContext } from "react";
import CurrentTemperatureUnitContext from "./CurrentTemperatureUnitContext";

function Main({ clothingItems, handleOpenItemModal, weatherData }) {
  const { currentTempUnit } = useContext(CurrentTemperatureUnitContext);

  const temp = weatherData.temp[currentTempUnit];
  let tempCategory = "";

  if (typeof temp === "number") {
    if (currentTempUnit === "F") {
      if (temp >= 86) tempCategory = "hot";
      else if (temp >= 66) tempCategory = "warm";
      else tempCategory = "cold";
    } else {
      if (temp >= 30) tempCategory = "hot";
      else if (temp >= 19) tempCategory = "warm";
      else tempCategory = "cold";
    }
  }

  const filteredItems = clothingItems.filter(
    (item) => item.weather.toLowerCase() === tempCategory
  );

  return (
    <main className="main">
      <WeatherCard weatherData={weatherData} />
      <p className="main__text">
        Today is a {tempCategory} {temp}&deg;{currentTempUnit} / You may want to
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
