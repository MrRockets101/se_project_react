import avatar from "../images/user-avatar.png";
import "../index.css";

function SideBar({ currentUser, handleSignOut, handleOpenEditProfileModal }) {
  // Placeholder avatar with first letter if no avatar
  const getPlaceholderAvatar = () => {
    if (!currentUser?.name) return avatar;
    const firstLetter = currentUser.name.charAt(0).toUpperCase();
    return <div className="sidebar__avatar-placeholder">{firstLetter}</div>;
  };

  return (
    <aside className="sidebar__block">
      <p className="sidebar__username">{currentUser?.name || "Guest"}</p>
      {currentUser?.avatar ? (
        <img
          src={currentUser.avatar}
          alt="User Avatar"
          className="sidebar__user-avatar"
        />
      ) : (
        getPlaceholderAvatar()
      )}
      <div className="sidebar__row"></div>
      <button
        className="sidebar__edit-profile-button"
        onClick={handleOpenEditProfileModal}
      >
        Change profile data
      </button>
      <button className="sidebar__sign-out-button" onClick={handleSignOut}>
        Sign out
      </button>
    </aside>
  );
}

export default SideBar;
