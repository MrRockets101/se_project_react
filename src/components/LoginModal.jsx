import { useEffect, useMemo, useState, useRef } from "react";
import "../index.css";
import { useForm } from "../hooks/useForm";
import { useModalClose } from "../hooks/useModalClose";
import { getErrorMessage } from "../utils/errorMessage";

function LoginModal({
  isOpen,
  handleSubmit: onSubmitFromApp,
  handleCloseModal,
  apiError: parentApiError,
  setApiError,
  onSwitchToRegister,
}) {
  const initialValues = useMemo(
    () => ({
      email: "",
      password: "",
    }),
    []
  );

  const customValidate = (v, setErrs, setDisabled) => {
    const errs = {};
    let isValid = true;

    if (!v.email) {
      errs.email = getErrorMessage("required", "email");
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(v.email)) {
      errs.email = getErrorMessage("invalidFormat", "email");
      isValid = false;
    }
    if (!v.password) {
      errs.password = getErrorMessage("required", "password");
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
  } = useForm(initialValues, customValidate, null, null, () =>
    setLocalApiError("")
  );

  const [localApiError, setLocalApiError] = useState("");
  const modalRef = useRef(null);
  const resetFormRef = useRef(resetForm); // Stabilize resetForm
  const setApiErrorRef = useRef(setApiError); // Stabilize setApiError

  useEffect(() => {
    if (isOpen) {
      resetFormRef.current();
      setLocalApiError("");
      setApiErrorRef.current(""); // Use ref to avoid re-render loop
    }
  }, [isOpen]); // Only depends on isOpen

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await onSubmitFromApp(values);
      resetForm();
      handleCloseModal();
    } catch (error) {
      console.error("Failed to login:", error);
      const message = error.message || getErrorMessage("apiGeneric");
      setLocalApiError(message);
      setApiErrorRef.current(message); // Use ref for error propagation
    }
  };

  useModalClose(isOpen, modalRef, handleCloseModal);

  return (
    <div className={`modal${isOpen ? " modal_is-opened" : ""}`}>
      <div className="modal__container modal__container_form" ref={modalRef}>
        <h2 className="modal__title">Log in</h2>
        <button
          className="modal__close-button modal__close-button_form"
          type="button"
          onClick={handleCloseModal}
        ></button>
        <form onSubmit={handleSubmit} className="modal__form" name="login-form">
          <fieldset className="modal__fieldset">
            <label htmlFor="input-login-email" className="modal__label">
              Email
            </label>
            <input
              id="input-login-email"
              type="email"
              className="modal__input"
              name="email"
              placeholder="Email"
              value={values.email}
              onChange={handleChange}
            />
            {errors?.email && (
              <p className="modal__error-message">{errors.email}</p>
            )}

            <label htmlFor="input-login-password" className="modal__label">
              Password
            </label>
            <input
              id="input-login-password"
              type="password"
              className="modal__input"
              name="password"
              placeholder="Password"
              value={values.password}
              onChange={handleChange}
            />
            {errors?.password && (
              <p className="modal__error-message">{errors.password}</p>
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
            >
              Log in
            </button>
            <p className="modal__switch">
              or{" "}
              <button
                className="modal__switch-link"
                type="button"
                onClick={onSwitchToRegister}
              >
                Register
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginModal;
