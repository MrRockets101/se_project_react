import { useContext } from "react";
import "../index.css";
import CurrentUserContext from "../Context/CurrentUserContext";

function ItemCard({ data, onCardClick, onCardLike, isProfile }) {
  const currentUser = useContext(CurrentUserContext);

  const handleOpenCard = () => {
    onCardClick(data);
  };

  const handleLike = (e) => {
    e.stopPropagation(); // avoid opening the modal
    onCardLike(data);
  };

  const imageClassName = `card__image${
    isProfile ? " clothes-section__card-image" : ""
  }`;

  const isLiked = data.likes?.some((id) => id === currentUser?._id);
  const likeButtonClassName = `card__like-button${
    isLiked ? " card__like-button_active" : ""
  }`;

  return (
    <li className="card">
      <div className="card__header">
        <h2 className="card__title">{data.name}</h2>
        {currentUser && (
          <button
            className={likeButtonClassName}
            type="button"
            onClick={handleLike}
            aria-label={isLiked ? "Unlike" : "Like"}
          ></button>
        )}
      </div>
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
