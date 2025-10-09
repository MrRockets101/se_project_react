import "../index.css";
import ClothesSection from "./ClothesSection";
import SideBar from "./SideBar";

function Profile({
  clothingItems,
  handleOpenItemModal,
  handleOpenAddGarmentModal,
  handleSignOut,
  handleOpenEditProfileModal,
  onCardLike,
}) {
  return (
    <div className="profile">
      <SideBar
        handleSignOut={handleSignOut}
        handleOpenEditProfileModal={handleOpenEditProfileModal}
      />
      <ClothesSection
        clothingItems={clothingItems}
        isProfile={true}
        handleOpenItemModal={handleOpenItemModal}
        handleOpenAddGarmentModal={handleOpenAddGarmentModal}
        onCardLike={onCardLike}
      />
    </div>
  );
}

export default Profile;
