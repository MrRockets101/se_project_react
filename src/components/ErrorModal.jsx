import React from "react";
import { getErrorMessage } from "../utils/errorMessages";

function ErrorModal({
  isOpen,
  message,
  title = getErrorMessage("apiGeneric", null, "Error"),
  onClose,
  className = "",
}) {
  if (!isOpen) return null;

  return (
    <div className={`modal${isOpen ? " modal_is-opened" : ""}`}>
      <div
        className={`modal__container modal__container_form ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="modal__close-button modal__close-button_form"
          type="button"
          onClick={onClose}
        ></button>
        <h2 className="modal__title">{title}</h2>
        <p className="modal__error-message">{message}</p>
        <button className="modal__submit-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

export default ErrorModal;
