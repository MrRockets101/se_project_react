import React from "react";
import { getErrorMessage, getContextErrorMessage } from "../utils/errorMessage";

function ErrorModal({
  isOpen,
  message,
  errorType,
  title = getErrorMessage("apiGeneric", null, "Error"),
  onClose,
  errorTriggerModal,
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
        <p className="modal__error-message">
          {getContextErrorMessage(errorType, message, errorTriggerModal)}
        </p>
        <button className="modal__submit-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

export default ErrorModal;
