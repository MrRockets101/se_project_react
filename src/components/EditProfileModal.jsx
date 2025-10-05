import { useEffect, useMemo, useState, useRef } from "react";
import "../index.css";
import { useForm } from "../hooks/useForm";
import { useModalClose } from "../hooks/useModalClose";

function EditProfileModal({
  isOpen,
  handleSubmit: onSubmitFromApp,
  handleCloseModal,
  apiError: parentApiError,
  setApiError,
  currentUser,
}) {
  const initialValues = useMemo(
    () => ({
      name: currentUser?.name || "",
      avatar: currentUser?.avatar || "",
    }),
    [currentUser]
  );

  const customValidate = (v, setErrs, setDisabled) => {
    const errs = {};
    let isValid = true;

    if (!v.name) {
      errs.name = "Name is required.";
      isValid = false;
    } else if (v.name.length < 2) {
      errs.name = "Name must be at least 2 characters.";
      isValid = false;
    }
    if (!v.avatar) {
      errs.avatar = "Avatar URL is required.";
      isValid = false;
    } else if (
      !/^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/.test(v.avatar)
    ) {
      errs.avatar = "Invalid URL format.";
      isValid = false;
    }

    setErrs(errs);
    setDisabled(!isValid);
    return isValid;
  };

  const {
    values,
    errors,
    handleChange,
    validate,
    resetForm,
    isButtonDisabled,
  } = useForm(initialValues, customValidate);

  const [localApiError, setLocalApiError] = useState("");

  const modalRef = useRef(null);
  useModalClose(isOpen, modalRef, handleCloseModal);

  useEffect(() => {
    if (isOpen) {
      resetForm(); // Pre-fill with currentUser data via initialValues
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
      console.error("Failed to update profile:", error);
      const message = error.message || "Failed to update profile.";
      setLocalApiError(message);
      if (setApiError) setApiError(message);
    }
  };

  return (
    <div className={`modal${isOpen ? " modal_is-opened" : ""}`}>
      <div className="modal__container modal__container_form" ref={modalRef}>
        <h2 className="modal__title">Change profile data</h2>
        <button
          className="modal__close-button modal__close-button_form"
          type="button"
          onClick={handleCloseModal}
        ></button>
        <form
          onSubmit={handleSubmit}
          className="modal__form"
          name="edit-profile-form"
        >
          <fieldset className="modal__fieldset">
            <label htmlFor="input-edit-name" className="modal__label">
              Name
            </label>
            <input
              id="input-edit-name"
              type="text"
              className="modal__input"
              name="name"
              placeholder="Enter your name"
              value={values.name}
              onChange={handleChange}
              autoComplete="name"
            />
            {errors?.name && (
              <p className="modal__error-message">{errors.name}</p>
            )}

            <label htmlFor="input-edit-avatar" className="modal__label">
              Avatar URL
            </label>
            <input
              id="input-edit-avatar"
              type="url"
              className="modal__input"
              name="avatar"
              placeholder="Enter avatar URL"
              value={values.avatar}
              onChange={handleChange}
              autoComplete="url"
            />
            {errors?.avatar && (
              <p className="modal__error-message">{errors.avatar}</p>
            )}
          </fieldset>

          {localApiError || parentApiError ? (
            <p className="modal__error-message modal__error-message_api">
              {localApiError || parentApiError}
            </p>
          ) : null}
          <div className="modal__button-container">
            <button
              className="modal__submit-button"
              type="submit"
              disabled={isButtonDisabled}
              style={{ backgroundColor: "#007bff", color: "#fff" }} // Figma blue
            >
              Save changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfileModal;
