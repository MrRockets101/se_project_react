import { Link } from "react-router-dom";
import logo from "../images/wtwr-logo.svg";
import "../index.css";
import ToggleSwitch from "./ToggleSwitch";

function Header({
  weatherData,
  handleOpenAddGarmentModal,
  apiLocationError,
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
          {apiLocationError && weatherData?.name === "Unknown" && (
            <p className="error-message">{apiLocationError}.</p>
          )}
        </p>
      </div>

      <div className="header__partition">
        <ToggleSwitch />

        {isAuthenticated ? (
          <div className="header__partition">
            <button
              onClick={handleOpenAddGarmentModal}
              className="header__add-clothes-button"
            >
              + Add clothes
            </button>
            <Link to="/profile" className="header__profile-link">
              <p className="header__username">{currentUser?.name || "User"}</p>
              {currentUser?.avatar && (
                <img
                  src={currentUser.avatar}
                  alt={`${currentUser.name} avatar`}
                  className="header__avatar"
                />
              )}
            </Link>
          </div>
        ) : (
          <div className="header__auth-buttons">
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
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
