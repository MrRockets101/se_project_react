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
}) {
  const now = new Date();
  const date = now.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });

  return (
    <header className="header">
      <div className="header__partition">
        {/* <link to="/homepage" className="header__logo-link"> */}
        <img src={logo} alt="WTWR Logo" className="header_logo" />
        {/* </link> */}
        <p className="header__location">
          <time className="header__calender" dateTime={now}>
            {date}
          </time>
          , {weatherData.city}
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
        <link to="/profile" className="header__profile-link">
          <p className="header__username">Terrence Tegegne</p>
          <img src={avatar} alt="User Avatar" className="header__user-avatar" />
        </link>
      </div>
    </header>
  );
}

export default Header;
