import logo from "../images/wtwr-logo.svg";
import avatar from "../images/user-avatar.png";
import "../blocks/Index.css";
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
        <img src={logo} alt="WTWR Logo" className="header_logo" />
        <p className="header__location">
          <time className="header__calender" dateTime={now}>
            {date}
          </time>
          , {weatherData.city}
          {apiLocationError && (
            <p className="error-message">Location error: {apiLocationError}</p>
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
        <p className="header__username">Terrence Tegegne</p>
        <img src={avatar} alt="User Avatar" className="header__user-avatar" />
      </div>
    </header>
  );
}
export default Header;
