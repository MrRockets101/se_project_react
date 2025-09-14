import WeatherCard from "./WeatherCard.jsx";

import ItemCard from "./ItemCard.jsx";
import "../blocks/Index.css";
function Main({
  clothingItems,
  handleOpenItemModal,
  weatherData,
  tempCategory,
}) {
  return (
    <main className="main">
      <WeatherCard weatherData={weatherData} />
      <p className="main__text">
        Today is a{" "}
        {tempCategory.charAt(0).toUpperCase() + tempCategory.slice(1)} — you may
        want to wear:
      </p>
      <ul className="main__card-list">
        {clothingItems.map((item) => {
          return (
            <ItemCard
              key={item._id}
              data={item}
              onCardClick={handleOpenItemModal}
            />
          );
        })}
      </ul>
    </main>
  );
}

export default Main;
