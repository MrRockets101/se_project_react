import { Link } from "react-router-dom";
import logo from "../images/wtwr-logo.svg";
import avatar from "../images/user-avatar.png";
import "../index.css";
import ToggleSwitch from "./ToggleSwitch";

function Header({
  weatherData,
  handleOpenAddGarmentModal,
  apiLocationError,
  apiWeatherError,
  handleOpenLocationModal,
  handleOpenRegisterModal,
  handleOpenLoginModal,
  isAuthenticated,
  currentUser,
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
          <time className="header__calender" dateTime={now.toISOString()}>
            {date}
          </time>
          ,{" "}
          <button
            className="header__location-button"
            onClick={handleOpenLocationModal}
            aria-label="Change location"
          >
            {weatherData?.name || "Unknown location"}
          </button>
          {apiLocationError && weatherData?.city === "Unknown" && (
            <p className="error-message">{apiLocationError}.</p>
          )}
        </p>
      </div>
      <div className="header__partition header__partition-right">
        <ToggleSwitch />
        {isAuthenticated ? (
          <>
            <button
              onClick={handleOpenAddGarmentModal}
              className="header__add-clothes-button"
            >
              + Add clothes
            </button>
            <Link to="/profile" className="header__profile-link">
              <p className="header__username">{currentUser?.name || "Guest"}</p>
            </Link>
          </>
        ) : (
          <>
            <button
              onClick={handleOpenRegisterModal}
              className="header__auth-button"
            >
              Sign Up
            </button>
            <button
              onClick={handleOpenLoginModal}
              className="header__auth-button"
            >
              Log In
            </button>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
