import "../index.css";
import ClothesSection from "./ClothesSection";
import SideBar from "./SideBar";

function Profile({
  clothingItems,
  handleOpenItemModal,
  handleOpenAddGarmentModal,
}) {
  return (
    <div className="profile">
      <SideBar />
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
