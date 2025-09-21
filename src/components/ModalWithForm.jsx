import { useEffect, useRef } from "react";
import "../index.css";

function ModalWithForm({
  isOpen,
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
  categories = [],
}) {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleOverlayClose = (event) => {
      const escKey = event.type === "keydown" && event.key === "Escape";
      const offClick =
        event.type === "mousedown" &&
        modalRef.current &&
        !modalRef.current.contains(event.target);

      if (escKey || offClick) {
        handleCloseModal();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleOverlayClose);
      document.addEventListener("mousedown", handleOverlayClose);
    }

    return () => {
      document.removeEventListener("keydown", handleOverlayClose);
      document.removeEventListener("mousedown", handleOverlayClose);
    };
  }, [isOpen, handleCloseModal]);

  return (
    <div
      className={`modal${isOpen ? " modal_is-opened" : ""}`}
      role="dialog"
      aria-modal="true"
    >
      <div className="modal__container modal__container_form" ref={modalRef}>
        <h2 className="modal__title">{title}</h2>
        <button
          className="modal__close-button modal__close-button_form"
          type="button"
          onClick={handleCloseModal}
        ></button>
        <form onSubmit={handleSubmit} className="modal__form" name={name}>
          {/* Fieldset 1: Name & Image */}
          <fieldset className="modal__fieldset">
            <label htmlFor="input-add-garment-name" className="modal__label">
              Name
            </label>
            <input
              id="input-add-garment-name"
              type="text"
              className="modal__input"
              name="name"
              placeholder="Name"
              value={values.name}
              onChange={handleChange}
            />
            {errorMessages.name && (
              <p className="modal__error-message">{errorMessages.name}</p>
            )}

            <label htmlFor="input-add-garment-image" className="modal__label">
              Image
            </label>
            <input
              id="input-add-garment-image"
              type="url"
              className="modal__input"
              name="image"
              placeholder="Image URL"
              value={values.image}
              onChange={handleChange}
            />
            {errorMessages.image && (
              <p className="modal__error-message">{errorMessages.image}</p>
            )}
          </fieldset>

          {/* Fieldset 2: Weather Options */}
          <fieldset className="modal__fieldset">
            <legend className="modal__fieldset-legend">
              Select weather type:
            </legend>
            {categories.map(({ name }) => {
              const capitalized = name.charAt(0).toUpperCase() + name.slice(1);
              const value = name.toLowerCase();
              const isSelected = values.weather === value;

              return (
                <div
                  key={name}
                  className={`modal__radio ${
                    isSelected ? "modal__radio_selected" : ""
                  }`}
                >
                  <input
                    className="modal__input-radio"
                    type="radio"
                    id={name}
                    name="weather"
                    value={value}
                    checked={isSelected}
                    onChange={handleChange}
                  />
                  <label className="modal__label" htmlFor={name}>
                    {capitalized}
                  </label>
                </div>
              );
            })}
            {errorMessages.weather && (
              <p className="modal__error-message">{errorMessages.weather}</p>
            )}
          </fieldset>

          {/* API Error */}
          {apiError && (
            <p className="modal__error-message modal__error-message_api">
              {apiError}
            </p>
          )}

          {/* Submit */}
          <button
            className="modal__submit-button"
            type="submit"
            disabled={isButtonDisabled}
          >
            {buttonText}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ModalWithForm;
