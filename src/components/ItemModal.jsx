import { useContext, useRef } from "react";
import "../index.css";
import CurrentUserContext from "../Context/CurrentUserContext";
import { useModalClose } from "../hooks/useModalClose";

function ItemModal({
  card,
  isOpen,
  handleCloseModal,
  handleDeleteItem,
  apiError,
  setApiError,
}) {
  const currentUser = useContext(CurrentUserContext);
  const modalRef = useRef(null);

  useModalClose(isOpen, modalRef, handleCloseModal);

  const isOwn = currentUser?._id && card.owner === currentUser._id;

  return (
    <div className={`modal${isOpen ? " modal_is-opened" : ""}`}>
      <div className="modal__overlay" onClick={handleCloseModal}></div>

      <div ref={modalRef} className="modal__container modal__container_image">
        <button
          className="modal__close-button modal__close-button_image"
          type="button"
          onClick={handleCloseModal}
        ></button>
        <img src={card.imageUrl} alt={card.name} className="modal__image" />
        <div className="modal__footer">
          <div className="modal__text-container">
            <h2 className="modal__text">{card.name}</h2>
            <p className="modal__text">Weather: {card.weather}</p>
          </div>
          {isOwn && (
            <button
              className="modal__button-delete"
              type="button"
              onClick={() => handleDeleteItem(card)}
            >
              Delete item
            </button>
          )}
        </div>
        {apiError && <p className="modal__error-message">{apiError}</p>}
      </div>
    </div>
  );
}

export default ItemModal;
