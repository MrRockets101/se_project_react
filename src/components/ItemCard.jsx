import "../blocks/itemCard.css";

function ItemCard({ data }) {
  return (
    <li className="card">
      <h2 className="card__title">{data.name}</h2>
      <img src={data.link} alt={data.name} className="card__image" />
    </li>
  );
}
export default ItemCard;
