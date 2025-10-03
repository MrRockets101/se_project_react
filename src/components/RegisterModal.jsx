import { useEffect, useMemo, useState, useRef } from "react";
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
}) {
  const initialValues = useMemo(
    () => ({
      email: "",
      password: "",
      name: "",
      avatar: "",
    }),
    []
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
  } = useForm(initialValues, customValidate);

  const [localApiError, setLocalApiError] = useState("");

  const modalRef = useRef(null);
  useModalClose(isOpen, modalRef, handleCloseModal);

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
      console.error("Failed to register:", error);
      const message = error.message || "Failed to register.";
      setLocalApiError(message);
      if (setApiError) setApiError(message);
    }
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
              value={values.email}
              onChange={handleChange}
            />
            {errors?.email && (
              <p className="modal__error-message">{errors.email}</p>
            )}

            <label htmlFor="input-register-password" className="modal__label">
              Password
            </label>
            <input
              id="input-register-password"
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

            <label htmlFor="input-register-name" className="modal__label">
              Name
            </label>
            <input
              id="input-register-name"
              type="text"
              className="modal__input"
              name="name"
              placeholder="Name"
              value={values.name}
              onChange={handleChange}
            />
            {errors?.name && (
              <p className="modal__error-message">{errors.name}</p>
            )}

            <label htmlFor="input-register-avatar" className="modal__label">
              Avatar URL
            </label>
            <input
              id="input-register-avatar"
              type="url"
              className="modal__input"
              name="avatar"
              placeholder="Avatar URL"
              value={values.avatar}
              onChange={handleChange}
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
        </form>
      </div>
    </div>
  );
}

export default RegisterModal;
