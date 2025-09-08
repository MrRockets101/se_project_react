import "../blocks/itemModal.css";

function ItemModal({ card, isOpen, handleCloseModal }) {
  return (
    <div className={`modal${isOpen ? " modal_is-opened" : ""}`}>
      <div className="modal__container">
        <button
          className="modal__close-button"
          onClick={handleCloseModal}
        ></button>
        <img src={card.link} alt={card.name} className="modal__image" />
        <div className="modal__footer">
          <h2 className="modal__text">{card.name}</h2>
          <p className="modal__text">{card.weather}</p>
        </div>
      </div>
    </div>
  );
}

export default ItemModal;
