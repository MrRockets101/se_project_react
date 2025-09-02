import logo from "../images/wtwr-logo.svg";
import avatar from "../images/user-avatar.png";
import "../blocks/header.css";
function Header() {
  const now = new Date();
  const date = now.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });

  return (
    <header className="header">
      <img src={logo} alt="WTWR Logo" className="header_logo" />
      <p className="header__location">
        <time className="header__calender" dateTime={now}>
          {date}
        </time>
        , New York
      </p>
      <button className="header__add-clothes-button">+ add clothes</button>
      <p className="header__username">Terrence Tegegne</p>
      <img src={avatar} alt="User Avatar" className="header__user-avatar"></img>
    </header>
  );
}
export default Header;
