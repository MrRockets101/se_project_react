import { Link } from "react-router-dom";
import logo from "../images/wtwr-logo.svg";
import avatar from "../images/user-avatar.png";
import "../index.css";
import ToggleSwitch from "./toggleSwitch";

function Header({
  weatherData,
  handleOpenAddGarmentModal,
  apiLocationError,
  apiWeatherError,
  handleOpenLocationModal,
}) {
  const now = new Date();
  const date = now.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });

  return (
    <header className="header">
      <div className="header__partition">
        <Link to="/" className="header__logo-link">
          <img src={logo} alt="WTWR Logo" className="header_logo" />
        </Link>

        <p className="header__location">
          <time className="header__calender" dateTime={now}>
            {date}
          </time>
          ,{" "}
          <button
            className="header__location-button"
            onClick={handleOpenLocationModal}
            aria-label="Change location"
          >
            {weatherData.city}
          </button>
          {apiLocationError && weatherData.city === "Unknown" && (
            <p className="error-message">{apiLocationError}.</p>
          )}
        </p>
      </div>
      <div className="header__partition">
        <ToggleSwitch />
        <button
          onClick={handleOpenAddGarmentModal}
          className="header__add-clothes-button"
        >
          + Add clothes
        </button>
        <Link to="/Profile" className="header__profile-link">
          <p className="header__username">Terrence Tegegne</p>
          <img src={avatar} alt="User Avatar" className="header__user-avatar" />
        </Link>
      </div>
    </header>
  );
}

export default Header;
