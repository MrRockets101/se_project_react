import avatar from "../images/user-avatar.png";
import "../index.css";

function SideBar() {
  return (
    <aside className="sidebar__block">
      <p className="sidebar__username">Terrence Tegegne</p>
      <img src={avatar} alt="User Avatar" className="sidebar__user-avatar" />
      <div className="sidebar__row"></div>
    </aside>
  );
}
export default SideBar;
