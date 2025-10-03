import avatar from "../images/user-avatar.png";
import "../index.css";

function SideBar({ currentUser }) {
  return (
    <aside className="sidebar__block">
      <p className="sidebar__username">{currentUser?.name || "Guest"}</p>
      <img
        src={currentUser?.avatar || avatar}
        alt="User Avatar"
        className="sidebar__user-avatar header__user-avatar"
      />
      <div className="sidebar__row"></div>
    </aside>
  );
}

export default SideBar;
