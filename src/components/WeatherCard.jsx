import cloudy from "../images/cloudy.png";
import sunny from "../images/sunny.png";
import rainy from "../images/rainy.png";
import snowy from "../images/snowy.png";

function WeatherCard({ temperature, condition }) {
  return (
    <section className="weather-card">
      <img src={cloudy} alt="Cloudy Weather" className="weather-card__image" />
    </section>
  );
}
export default WeatherCard;
