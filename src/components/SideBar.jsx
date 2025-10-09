import { useContext } from "react";
import avatar from "../images/user-avatar.png";
import "../index.css";
import CurrentUserContext from "../Context/CurrentUserContext";

function SideBar({ handleSignOut, handleOpenEditProfileModal }) {
  const currentUser = useContext(CurrentUserContext);

  // Placeholder avatar with first letter if no avatar
  const getPlaceholderAvatar = () => {
    if (!currentUser?.name) return avatar;
    const firstLetter = currentUser.name.charAt(0).toUpperCase();
    return <div className="sidebar__avatar-placeholder">{firstLetter}</div>;
  };

  return (
    <aside className="sidebar__block">
      <aside className="sidebar__row">
        {currentUser?.avatar ? (
          <img
            src={currentUser.avatar}
            alt="User Avatar"
            className="sidebar__user-avatar"
          />
        ) : (
          getPlaceholderAvatar()
        )}
        <p className="sidebar__username">{currentUser?.name || "Guest"}</p>
      </aside>
      <button
        className="sidebar__edit-profile-button"
        onClick={handleOpenEditProfileModal}
      >
        Change profile data
      </button>
      <button className="sidebar__button-sign-out" onClick={handleSignOut}>
        Sign out
      </button>
    </aside>
  );
}

export default SideBar;
