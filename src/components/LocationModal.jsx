import { useState } from "react";

function LocationModal({ onClose, onUpdateLocation }) {
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [error, setError] = useState("");

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        onUpdateLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => setError("Unable to retrieve your location.")
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    if (
      isNaN(latitude) ||
      latitude < -90 ||
      latitude > 90 ||
      isNaN(longitude) ||
      longitude < -180 ||
      longitude > 180
    ) {
      setError("Please enter valid latitude and longitude values.");
      return;
    }

    onUpdateLocation({ latitude, longitude });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Select Location</h2>
        {error && <p className="error-message">{error}</p>}
        <button onClick={handleUseCurrentLocation}>Use Current Location</button>
        <hr />
        <form onSubmit={handleSubmit}>
          <label>
            Latitude:
            <input
              type="number"
              step="any"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              required
            />
          </label>
          <label>
            Longitude:
            <input
              type="number"
              step="any"
              value={lng}
              onChange={(e) => setLng(e.target.value)}
              required
            />
          </label>
          <button type="submit">Set Location</button>
        </form>
        <button onClick={onClose} className="modal-close-button">
          Close
        </button>
      </div>
    </div>
  );
}

export default LocationModal;
