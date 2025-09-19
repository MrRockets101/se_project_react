import "../index.css";

function ItemCard({ data, onCardClick, isProfile }) {
  function handleOpenCard() {
    onCardClick(data);
  }

  const imageClassName = `card__image${
    isProfile ? " clothes-section__card-image" : ""
  }`;

  return (
    <li className="card">
      <h2 className="card__title">{data.name}</h2>
      <img
        src={data.imageUrl}
        alt={data.name}
        className={imageClassName}
        onClick={handleOpenCard}
      />
    </li>
  );
}
export default ItemCard;
