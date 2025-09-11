import cloudy from "../images/cloudy.png";
// import sunny from "../images/sunny.png";
// import rainy from "../images/rainy.png";
// import snowy from "../images/snowy.png";
import "../blocks/Index.css";
function WeatherCard({ temperature, condition }) {
  return (
    <section className="weatherCard">
      <img src={cloudy} alt="Cloudy Weather" className="weatherCard__image" />
      <p className="weatherCard__temperature">75°F</p>
    </section>
  );
}
export default WeatherCard;
