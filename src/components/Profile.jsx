import "../index.css";
import ClothesSection from "./ClothesSection";
import SideBar from "./SideBar";

function Profile({
  clothingItems,
  handleOpenItemModal,
  handleOpenAddGarmentModal,
  currentUser,
}) {
  return (
    <div className="profile">
      <SideBar currentUser={currentUser} />
      <ClothesSection
        clothingItems={clothingItems}
        isProfile={true}
        handleOpenItemModal={handleOpenItemModal}
        handleOpenAddGarmentModal={handleOpenAddGarmentModal}
      />
    </div>
  );
}

export default Profile;
