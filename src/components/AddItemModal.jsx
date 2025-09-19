import { useRef, useEffect } from "react";
import "../index.css";
function AddItemModal({
  isOpen,
  children,
  handleSubmit,
  title,
  buttonText,
  name,
  errorMessages = {},
  handleCloseModal,
  isButtonDisabled,
}) {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleOverlayClose = (event) => {
      const escKey = event.type === "keydown" && event.key === "Escape";
      const offClick =
        event.type === "mousedown" &&
        modalRef.current &&
        !modalRef.current.contains(event.target);

      if (escKey || offClick) {
        handleCloseModal();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleOverlayClose);
      document.addEventListener("mousedown", handleOverlayClose);
    }

    return () => {
      document.removeEventListener("keydown", handleOverlayClose);
      document.removeEventListener("mousedown", handleOverlayClose);
    };
  }, [isOpen, handleCloseModal]);

  return (
    <div
      className={`modal${isOpen ? " modal_is-opened" : ""}`}
      role="dialog"
      aria-modal="true"
    >
      <div className="modal__container modal__container_form" ref={modalRef}>
        <h2 className="modal__title">{title}</h2>
        <button
          className="modal__close-button modal__close-button_form"
          type="button"
          onClick={handleCloseModal}
        ></button>
        <form onSubmit={handleSubmit} className="modal__form" name={name}>
          {children}
          <button
            className="modal__submit-button"
            type="submit"
            disabled={isButtonDisabled}
          >
            {buttonText}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddItemModal;
