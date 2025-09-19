import "../index.css";
import ClothesSection from "./ClothesSection";
import SideBar from "./SideBar";

function Profile({ defaultClothingItems }) {
  return (
    <div className="profile">
      <SideBar />{" "}
      <ClothesSection
        defaultClothingItems={defaultClothingItems}
        isProfile={true}
      />
    </div>
  );
}
export default Profile;
