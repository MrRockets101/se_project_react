import { useContext } from "react";
import "../index.css";
import CurrentUserContext from "../Context/CurrentUserContext";

function ItemModal({ card, isOpen, handleCloseModal, handleDeleteItem }) {
  const currentUser = useContext(CurrentUserContext);

  const isOwn = currentUser?._id && card.owner === currentUser._id;
  const itemDeleteButtonClassName = `modal__delete-button ${
    isOwn ? "" : "modal__delete-button_hidden"
  }`;

  return (
    <div className={`modal${isOpen ? " modal_is-opened" : ""}`}>
      <div
        className="modal__container modal__container_image"
        onClick={handleCloseModal}
      >
        <button
          className="modal__close-button modal__close-button_image"
          type="button"
          onClick={handleCloseModal}
        ></button>
        <img src={card.imageUrl} alt={card.name} className="modal__image" />
        <div className="modal__content">
          <div className="modal__caption">
            <h2 className="modal__title">{card.name}</h2>
            <p className="modal__weather">Weather: {card.weather}</p>
          </div>
          <button
            className={itemDeleteButtonClassName}
            type="button"
            onClick={() => handleDeleteItem(card)}
          >
            Delete item
          </button>
        </div>
      </div>
    </div>
  );
}

export default ItemModal;
