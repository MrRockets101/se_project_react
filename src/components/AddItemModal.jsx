import { useEffect, useMemo, useState } from "react";
import "../index.css";
import ModalWithForm from "./ModalWithForm";
import { useForm } from "../hooks/useForm";

function AddItemModal({
  isOpen,
  handleSubmit: onSubmitFromApp, // API call from parent
  title,
  buttonText,
  name,
  handleCloseModal,
  apiError: parentApiError,
  setApiError, // pass this from App.jsx to update API errors
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
      const message = error.message || "Failed to add item.";
      setLocalApiError(message);
      if (setApiError) setApiError(message); // propagate to App if needed
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
