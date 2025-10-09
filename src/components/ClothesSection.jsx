import { useContext } from "react";
import "../index.css";
import ItemCard from "./ItemCard";
import CurrentUserContext from "../Context/CurrentUserContext";

function ClothesSection({
  clothingItems,
  isProfile,
  handleOpenItemModal,
  handleOpenAddGarmentModal,
  onCardLike,
}) {
  const currentUser = useContext(CurrentUserContext);

  return (
    <section className="clothes-section">
      {isProfile && (
        <div className="clothes-section__header">
          <h2 className="clothes-section__title">Your Items</h2>
          <button
            className="clothes-section__button-add-new"
            onClick={handleOpenAddGarmentModal}
          >
            + Add New
          </button>
        </div>
      )}
      <ul className="clothes-section__card-list">
        {clothingItems
          .filter((item) => {
            return item.owner === currentUser?._id;
          })
          .map((item) => (
            <ItemCard
              key={item._id}
              data={item}
              onCardClick={handleOpenItemModal}
              isProfile={isProfile}
              onCardLike={onCardLike}
            />
          ))}
      </ul>
    </section>
  );
}

export default ClothesSection;
