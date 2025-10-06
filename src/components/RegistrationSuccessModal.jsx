import "../index.css";

function RegistrationSuccessModal({ isOpen, message, title, onClose }) {
  if (!isOpen) return null;

  return (
    <div className={`modal${isOpen ? " modal_is-opened" : ""}`}>
      <div className="modal__container">
        <h2 className="modal__title">{title}</h2>
        <button
          className="modal__close-button"
          type="button"
          onClick={onClose}
        ></button>
        <p className="modal__message">{message}</p>
        <button
          className="modal__submit-button"
          type="button"
          onClick={onClose}
        >
          OK
        </button>
      </div>
    </div>
  );
}

export default RegistrationSuccessModal;
