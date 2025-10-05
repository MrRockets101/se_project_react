import "../index.css";
import ItemCard from "./ItemCard";

function ClothesSection({
  clothingItems,
  isProfile,
  handleOpenItemModal,
  handleOpenAddGarmentModal,
  currentUser,
}) {
  return (
    <section className="clothes-section">
      {isProfile && (
        <div className="clothes-section__header">
          <h2 className="clothes-section__title">Your Items</h2>
          <button
            className="clothes-section__add-button"
            onClick={handleOpenAddGarmentModal}
          >
            + Add New
          </button>
        </div>
      )}
      <ul className="clothes-section__card-list">
        {clothingItems
          .filter((item) => item.owner === currentUser?._id)
          .map((item) => (
            <ItemCard
              key={item._id}
              item={item}
              onCardClick={handleOpenItemModal}
            />
          ))}
      </ul>
    </section>
  );
}

export default ClothesSection;
