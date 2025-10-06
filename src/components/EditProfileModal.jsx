import { useEffect, useMemo, useState, useRef } from "react";
import "../index.css";
import { useForm } from "../hooks/useForm";
import { useModalClose } from "../hooks/useModalClose";
import { getErrorMessage } from "../utils/errorMessage";

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
    let isValid = false; // default to false

    if (v.name && v.name.length < 2) {
      errs.name = getErrorMessage;
    }
    if (
      v.avatar &&
      !/^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/.test(v.avatar)
    ) {
      errs.avatar = getErrorMessage;
    }

    // Consider form valid if at least one field is non-empty and valid
    isValid = (!!v.name && !errs.name) || (!!v.avatar && !errs.avatar);

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
      resetForm();
      setLocalApiError("");
      if (setApiError) setApiError(""); // clear parent API errors
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalApiError("");
    if (!validate()) return;

    const partialData = {};
    if (values.name) partialData.name = values.name;
    if (values.avatar) partialData.avatar = values.avatar;

    try {
      await onSubmitFromApp(partialData); // send only non-empty fields
      resetForm();
      handleCloseModal();
    } catch (error) {
      console.error("Failed to update profile:", error);
      const message = error.message || getErrorMessage("apiGeneric");
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

          {(localApiError || parentApiError) && (
            <p className="modal__error-message">
              {localApiError || parentApiError}
            </p>
          )}
          <div className="modal__button-container">
            <button
              className="modal__submit-button"
              type="submit"
              disabled={isButtonDisabled}
              style={{ backgroundColor: "#007bff", color: "#fff" }}
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
