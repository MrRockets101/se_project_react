import { useEffect, useRef } from "react";
import "../index.css";

function ItemModal({ card, isOpen, handleCloseModal }) {
  const modalRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    function handleOverlayClose(event) {
      const isEscape = event.type === "keydown" && event.key === "Escape";
      const isOutsideClick =
        event.type === "mousedown" &&
        modalRef.current &&
        !modalRef.current.contains(event.target);

      if (isEscape || isOutsideClick) {
        handleCloseModal();
      }
    }

    document.addEventListener("keydown", handleOverlayClose);
    document.addEventListener("mousedown", handleOverlayClose);

    return () => {
      document.removeEventListener("keydown", handleOverlayClose);
      document.removeEventListener("mousedown", handleOverlayClose);
    };
  }, [isOpen, handleCloseModal]);

  return (
    <div className={`modal${isOpen ? " modal_is-opened" : ""}`}>
      <div className="modal__container" ref={modalRef}>
        <button
          className="modal__close-button"
          onClick={handleCloseModal}
        ></button>
        <img src={card.link} alt={card.name} className="modal__image" />
        <div className="modal__footer">
          <h2 className="modal__text">{card.name}</h2>
          <h2 className="modal__text">Weather: {card.weather}</h2>
        </div>
      </div>
    </div>
  );
}

export default ItemModal;
