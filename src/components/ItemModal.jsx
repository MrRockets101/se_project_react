import { useRef } from "react";
import "../index.css";
import { useModalClose } from "../hooks/useModalClose";

function ItemModal({ card, isOpen, handleCloseModal, handleDeleteItem }) {
  const modalRef = useRef(null);

  useModalClose(isOpen, modalRef, handleCloseModal);

  return (
    <div className={`modal${isOpen ? " modal_is-opened" : ""}`}>
      <div className="modal__container" ref={modalRef}>
        <button
          className="modal__close-button"
          onClick={handleCloseModal}
        ></button>
        <img src={card.imageUrl} alt={card.name} className="modal__image" />
        <div className="modal__footer">
          <div className="modal__text-container">
            <p className="modal__text">{card.name}</p>
            <p className="modal__text">Weather: {card.weather}</p>
          </div>
          <div className="modal__delete-button-container">
            <button
              className="modal__button-delete"
              onClick={() => handleDeleteItem(card)}
            >
              Delete item
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItemModal;
