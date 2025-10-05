import "../index.css";
import ClothesSection from "./ClothesSection";
import SideBar from "./SideBar";

function Profile({
  clothingItems,
  handleOpenItemModal,
  handleOpenAddGarmentModal,
  currentUser,
  handleSignOut,
  handleOpenEditProfileModal,
}) {
  return (
    <div className="profile">
      <SideBar
        currentUser={currentUser}
        handleSignOut={handleSignOut}
        handleOpenEditProfileModal={handleOpenEditProfileModal}
      />
      <ClothesSection
        clothingItems={clothingItems}
        isProfile={true}
        handleOpenItemModal={handleOpenItemModal}
        handleOpenAddGarmentModal={handleOpenAddGarmentModal}
        currentUser={currentUser}
      />
    </div>
  );
}

export default Profile;
