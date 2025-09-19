import "../index.css";
import ItemCard from "./ItemCard.jsx";

function ClothesSection({
  defaultClothingItems,
  handleOpenItemModal,
  isProfile,
}) {
  return (
    <section className="clothes-section">
      <div className="clothes-section__row">
        Your items
        <button className="clothes-section__button-add-new">+ Add new</button>
      </div>
      <ul className="clothes-section__card-list">
        {defaultClothingItems.map((item) => (
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
