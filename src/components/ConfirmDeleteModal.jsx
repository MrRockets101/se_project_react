import React, { useRef } from "react";
import "../index.css";
import { useModalClose } from "../hooks/useModalClose";
import { getErrorMessage } from "../utils/errorMessages";

function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  apiError,
  setApiError,
}) {
  const modalRef = useRef(null);

  useModalClose(isOpen, modalRef, onClose);

  return (
    <div className={`modal${isOpen ? " modal_is-opened" : ""}`}>
      <div className="modal__container" ref={modalRef}>
        <button className="modal__close-button" onClick={onClose}></button>
        <div className="modal__container-delete">
          <p className="modal__text">
            Are you sure you want to delete this item?
          </p>
          <p className="modal__text">This action is irreversible.</p>
          <button className="modal__button-delete-confirm" onClick={onConfirm}>
            Yes, delete item
          </button>
          <button className="modal__button-cancel" onClick={onClose}>
            Cancel
          </button>
          {apiError && <p className="modal__error-message">{apiError}</p>}
        </div>
      </div>
    </div>
  );
}

export default ConfirmDeleteModal;
