import "../index.css";
import { useRef, useState } from "react";
import { useWeatherLocation } from "../hooks/useWeatherLocation";
import { useModalClose } from "../hooks/useModalClose";
import { getErrorMessage } from "../utils/errorMessages";

function LocationModal({ onClose, onUpdateLocation }) {
  const [latInput, setLatInput] = useState("");
  const [lngInput, setLngInput] = useState("");
  const [formError, setFormError] = useState(null);

  const { detectIpLocation, setApiLocationError } = useWeatherLocation();

  const modalRef = useRef(null);
  useModalClose(true, modalRef, onClose);

  const handleChangeLat = (e) => setLatInput(e.target.value);
  const handleChangeLng = (e) => setLngInput(e.target.value);

  const handleSubmitLatLng = async (e) => {
    e.preventDefault();

    if (!latInput || !lngInput) {
      setFormError(
        getErrorMessage(
          "required",
          "coordinates",
          "Latitude and longitude are required"
        )
      );
      return;
    }

    const latitude = parseFloat(latInput);
    const longitude = parseFloat(lngInput);

    if (isNaN(latitude) || isNaN(longitude)) {
      setFormError(
        getErrorMessage("invalidFormat", "coordinates", "Invalid coordinates")
      );
      return;
    }

    try {
      await onUpdateLocation({ latitude, longitude });
      setFormError(null);
      onClose();
    } catch (error) {
      setFormError(
        getErrorMessage("apiGeneric", null, "Failed to update location")
      );
    }
  };

  const handleUseCurrentLocation = async () => {
    try {
      await detectIpLocation();
      onClose();
    } catch (error) {
      setApiLocationError(
        getErrorMessage("apiGeneric", null, "Failed to detect location via IP")
      );
    }
  };

  return (
    <div className="modal modal_is-opened">
      <div className="modal__container" ref={modalRef}>
        <div className="modal__container__location">
          <button className="modal__close-button" onClick={onClose} />
          <h2 className="modal__title-location">Select location</h2>

          {formError && <p className="modal__error-message">{formError}</p>}

          <button
            className="modal__button-location"
            onClick={handleUseCurrentLocation}
          >
            Use current location
          </button>
          <h2 className="modal__title-location">Or</h2>
          <form
            onSubmit={handleSubmitLatLng}
            className="modal__form modal__form-location"
          >
            <label className="modal__label">
              Latitude:
              <input
                type="number"
                step="any"
                value={latInput}
                onChange={handleChangeLat}
                className="modal__input"
                required
              />
            </label>
            <label className="modal__label">
              Longitude:
              <input
                type="number"
                step="any"
                value={lngInput}
                onChange={handleChangeLng}
                className="modal__input"
                required
              />
            </label>
            <button
              type="submit"
              className="modal__button-location-find modal__submit-button"
              disabled={!latInput || !lngInput}
            >
              Find location
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LocationModal;
