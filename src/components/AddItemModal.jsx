import { useRef, useEffect } from "react";
import "../index.css";
import ModalWithForm from "./ModalWithForm";

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
  values,
  handleChange,
  apiError,
  categories,
}) {
  return (
    <ModalWithForm
      {...{
        isOpen,
        children,
        handleSubmit,
        title,
        buttonText,
        name,
        errorMessages,
        handleCloseModal,
        isButtonDisabled,
        values,
        handleChange,
        apiError,
        categories,
      }}
    />
  );
}
export default AddItemModal;
