import WeatherCard from "../blocks/WeatherCard";
import "../blocks/itemCard.css";
import ".ItemCard.jsx";

function Main({ clothingItems }) {
  return (
    <main className="main">
      <WeatherCard />
      <p className="main__text">Today is 75 F / You may want to wear: </p>
      {clothingItems.map((item) => {
        return <ItemCard data={item} />;
      })}
    </main>
  );
}

export default Main;
