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
    <div className={`modal-overlay ${className}`} onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal__text">{title}</h2>
        <p className="modal__error-message">{message}</p>
        <button className="modal__close-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

export default ErrorModal;
