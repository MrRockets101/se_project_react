import "../index.css";
import ItemCard from "./ItemCard.jsx";

function ClothesSection({
  clothingItems,
  handleOpenItemModal,
  handleOpenAddGarmentModal,
  isProfile,
}) {
  return (
    <section className="clothes-section">
      <div className="clothes-section__row">
        Your items
        <button
          className="clothes-section__button-add-new"
          onClick={handleOpenAddGarmentModal}
        >
          + Add new
        </button>
      </div>
      <ul className="clothes-section__card-list">
        {clothingItems.map((item) => (
          <ItemCard
            key={item._id}
            data={item}
            onCardClick={handleOpenItemModal}
            isProfile={isProfile}
          />
        ))}
      </ul>
    </section>
  );
}
export default ClothesSection;
