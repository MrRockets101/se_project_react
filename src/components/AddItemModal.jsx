import { useEffect, useMemo } from "react";
import "../index.css";
import ModalWithForm from "./ModalWithForm";
import { useForm } from "../hooks/useForm";

function AddItemModal({
  isOpen,
  handleSubmit: onSubmitFromApp,
  title,
  buttonText,
  name,
  handleCloseModal,
  apiError,
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

  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen, resetForm]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await onSubmitFromApp(values);
      resetForm();
      handleCloseModal();
    } catch (error) {
      console.error("Failed to add item:", error);
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
      apiError={apiError}
      categories={categories}
    />
  );
}

export default AddItemModal;
