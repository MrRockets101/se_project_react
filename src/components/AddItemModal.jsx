import { useEffect, useMemo, useState } from "react";
import "../index.css";
import ModalWithForm from "./ModalWithForm";
import { useForm } from "../hooks/useForm";
import { getErrorMessage } from "../utils/errorMessage";

function AddItemModal({
  isOpen,
  handleSubmit: onSubmitFromApp,
  title,
  buttonText,
  name,
  handleCloseModal,
  apiError: parentApiError,
  setApiError,
  categories,
}) {
  const initialValues = useMemo(
    () => ({
      name: "",
      image: "",
      weather: "",
    }),
    []
  );

  const {
    values,
    errors,
    handleChange,
    validate,
    resetForm,
    isButtonDisabled,
  } = useForm(initialValues);

  const [localApiError, setLocalApiError] = useState("");

  useEffect(() => {
    if (isOpen) {
      resetForm();
      setLocalApiError("");
      if (setApiError) setApiError("");
    }
  }, [isOpen, resetForm, setApiError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalApiError("");
    if (!validate()) return;

    try {
      await onSubmitFromApp(values);
      resetForm();
      handleCloseModal();
    } catch (error) {
      console.error("Failed to add item:", error);
      const message = error.message || getErrorMessage("apiGeneric");
      setLocalApiError(message);
      if (setApiError) setApiError(message);
    }
  };

  return (
    <ModalWithForm
      isOpen={isOpen}
      handleSubmit={handleSubmit}
      title={title}
      buttonText={buttonText}
      name={name}
      handleCloseModal={handleCloseModal}
      errorMessages={errors}
      isButtonDisabled={isButtonDisabled}
      values={values}
      handleChange={handleChange}
      apiError={localApiError || parentApiError}
      categories={categories}
    />
  );
}

export default AddItemModal;
