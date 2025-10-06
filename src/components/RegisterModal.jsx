import { useEffect, useState, useRef } from "react";
import "../index.css";
import { useForm } from "../hooks/useForm";
import { useModalClose } from "../hooks/useModalClose";

function RegisterModal({
  isOpen,
  handleSubmit: onSubmitFromApp,
  handleCloseModal,
  apiError: parentApiError,
  setApiError,
  onSwitchToLogin,
  resetFormRef,
  initialValues,
}) {
  const [localValues, setLocalValues] = useState(
    initialValues || { email: "", password: "", name: "", avatar: "" }
  );

  const customValidate = (v, setErrs, setDisabled) => {
    const errs = {};
    let isValid = true;

    if (!v.email) {
      errs.email = "Email is required.";
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(v.email)) {
      errs.email = "Invalid email format.";
      isValid = false;
    }
    if (!v.password) {
      errs.password = "Password is required.";
      isValid = false;
    } else if (v.password.length < 6) {
      errs.password = "Password must be at least 6 characters.";
      isValid = false;
    }
    if (!v.name) {
      errs.name = "Name is required.";
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
    setSubmitSuccess,
  } = useForm(localValues, customValidate, null, (newValues) =>
    setLocalValues(newValues)
  ); // Sync values with local state

  const modalRef = useRef(null);
  useModalClose(isOpen, modalRef, handleCloseModal);

  // Assign resetForm to the ref provided by App.jsx
  useEffect(() => {
    if (resetFormRef) {
      resetFormRef.current = resetForm;
      console.log(
        "RegisterModal mounted, resetForm assigned to ref:",
        resetFormRef.current
      );
    }
  }, [resetForm, resetFormRef]);

  // Use effect to handle form reset and API error state on modal open
  useEffect(() => {
    if (isOpen) {
      console.log("Modal opened, values:", { ...values, password: "****" }); // Mask password
    }
  }, [isOpen, values]); // Removed setApiError call to preserve parentApiError

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await onSubmitFromApp(values);
      setSubmitSuccess(true); // Signal success to trigger reset
      resetForm(); // Ensure reset happens immediately on success
      handleCloseModal();
    } catch (error) {
      // Error is already logged and handled by fetchJson, propagate to App.jsx
      if (setApiError) setApiError(error.message); // Let App.jsx handle the error display
    }
  };

  const getApiErrorForField = (fieldName) => {
    if (parentApiError === "Email already exists" && fieldName === "email") {
      return parentApiError;
    }
    return "";
  };

  // Determine error message for disabled submit button
  const getSubmitErrorMessage = () => {
    if (!isButtonDisabled) return "";
    const requiredFields = ["email", "password", "name", "avatar"];
    const emptyFields = requiredFields.filter((field) => !values[field]);
    const errorFields = Object.keys(errors);

    if (emptyFields.length > 1) {
      return "Please fill out all required fields.";
    }
    if (errorFields.length === 0 && emptyFields.length === 1) {
      return `${emptyFields[0]} is causing a problem`;
    }
    if (errorFields.length === 1) {
      return `${errorFields[0]} is causing a problem`;
    }
    if (errorFields.length > 1) {
      const lastField = errorFields.pop();
      return `${errorFields.join(
        ", "
      )}, and ${lastField} are causing a problem`;
    }
    return "";
  };

  return (
    <div className={`modal${isOpen ? " modal_is-opened" : ""}`}>
      <div className="modal__container modal__container_form" ref={modalRef}>
        <h2 className="modal__title">Sign up</h2>
        <button
          className="modal__close-button modal__close-button_form"
          type="button"
          onClick={handleCloseModal}
        ></button>
        <form
          onSubmit={handleSubmit}
          className="modal__form"
          name="register-form"
        >
          <fieldset className="modal__fieldset">
            <label htmlFor="input-register-email" className="modal__label">
              Email
            </label>
            <input
              id="input-register-email"
              type="email"
              className="modal__input"
              name="email"
              placeholder="Email"
              value={values.email || ""}
              onChange={handleChange}
            />
            <p className="modal__error-message">
              {errors?.email || getApiErrorForField("email") || ""}
            </p>

            <label htmlFor="input-register-password" className="modal__label">
              Password
            </label>
            <input
              id="input-register-password"
              type="password"
              className="modal__input"
              name="password"
              placeholder="Password"
              value={values.password || ""}
              onChange={handleChange}
            />
            <p className="modal__error-message">{errors?.password || ""}</p>

            <label htmlFor="input-register-name" className="modal__label">
              Name
            </label>
            <input
              id="input-register-name"
              type="text"
              className="modal__input"
              name="name"
              placeholder="Name"
              value={values.name || ""}
              onChange={handleChange}
            />
            <p className="modal__error-message">{errors?.name || ""}</p>

            <label htmlFor="input-register-avatar" className="modal__label">
              Avatar URL
            </label>
            <input
              id="input-register-avatar"
              type="url"
              className="modal__input"
              name="avatar"
              placeholder="Avatar URL"
              value={values.avatar || ""}
              onChange={handleChange}
            />
            <p className="modal__error-message">{errors?.avatar || ""}</p>
          </fieldset>
          <div className="modal__button-container">
            <button
              className="modal__submit-button"
              type="submit"
              disabled={isButtonDisabled}
            >
              Next
            </button>
            <p className="modal__switch">
              or{" "}
              <button
                className="modal__switch-link"
                type="button"
                onClick={onSwitchToLogin}
              >
                Log in
              </button>
            </p>
          </div>
          {isButtonDisabled && (
            <div>
              <p className="modal__error-message">{getSubmitErrorMessage()}</p>
              {parentApiError && (
                <p className="modal__error-message">{parentApiError}</p>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default RegisterModal;
