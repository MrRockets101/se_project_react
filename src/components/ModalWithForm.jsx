import { useRef } from "react";
import "../index.css";
import { useModalClose } from "../hooks/useModalClose";
import { getErrorMessage } from "../utils/errorMessages";

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

  useModalClose(isOpen, modalRef, handleCloseModal);

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

          {apiError && <p className="modal__error-message">{apiError}</p>}

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
