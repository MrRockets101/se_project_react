import { useState, useEffect, useRef, useCallback } from "react";

import Header from "./Header";
import Main from "./main";
import Footer from "./footer";
import { defaultClothingItems } from "../utils/defaultClothingItems";
import ItemModal from "./ItemModal";
import ModalWithForm from "./ModalWithForm";
import "../index.css";
import { getWeatherData } from "../utils/weatherApi";
import CurrentTemperatureUnitContext from "../utils/CurrentTemperatureUnitContext";
import { userPreferenceArray } from "../utils/userPreferenceArray";
import { getTempCategory } from "../utils/getTempCategory";
import {
  getClientIpGeolocation,
  getServerIpGeolocation,
} from "../utils/ipGeolocation";

function App() {
  const [clothingItems, setClothingItems] = useState([]);
  const [activeModal, setActiveModal] = useState("");
  const [selectedCard, setSelectedCard] = useState({});
  const [selectedRadio, setSelectedRadio] = useState("");
  const [errorMessages, setErrorMessages] = useState({
    name: "",
    image: "",
    weather: "",
  });
  const [weatherData, setWeatherData] = useState({
    city: "Unknown",
    temp: {
      F: "--",
      C: "--",
    },
  });
  const [apiError, setApiError] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [nameInput, setNameInput] = useState("");
  const [imageInput, setImageInput] = useState("");

  const [currentTempUnit, setCurrentTempUnit] = useState("F");
  const temp = weatherData.temp[currentTempUnit];
  const tempCategory = getTempCategory(
    temp,
    currentTempUnit,
    userPreferenceArray
  );
  const filteredClothingItems = clothingItems.filter(
    (item) => item.weather.toLowerCase() === tempCategory.toLowerCase()
  );
  const unitConfig = userPreferenceArray.find(
    (config) => config.unit === currentTempUnit
  );
  const categories = unitConfig ? unitConfig.categories : [];
  const [apiLocationError, setApiLocationError] = useState(null);
  const [apiWeatherError, setApiWeatherError] = useState(null);
  const DEFAULT_COORDS = {
    latitude: 46.226667,
    longitude: 6.140556,
    source: "default",
  };

  function handleOpenItemModal(card) {
    setActiveModal("item-modal");
    setSelectedCard(card);
  }

  function handleOpenAddGarmentModal() {
    setActiveModal("item-garment-modal");
    setApiError("");
  }
  function handleTempUnitChange() {
    if (currentTempUnit === "F") {
      setCurrentTempUnit("C");
    } else {
      setCurrentTempUnit("F");
    }
  }
  function handleCloseModal() {
    setActiveModal("");
    setApiError("");
  }

  function handleRadioChange(event) {
    setSelectedRadio(event.target.value.toLowerCase());
    validateForm();
  }

  const formValidation = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("Form submitted successfully");
      }, 1000);
    });
  };
  const resetForm = () => {
    setNameInput("");
    setImageInput("");
    setSelectedRadio("");
    setErrorMessages({ name: "", image: "", weather: "" });
    setIsButtonDisabled(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setApiError("");
    try {
      const response = await formValidation();
      console.log("Form submitted successfully:", response);
      handleCloseModal();
      resetForm();
      setSelectedRadio("");
    } catch (error) {
      console.error("Error submitting form:", error);

      setApiError(error.message || "An error occurred during submission.");
    }
  };

  const validateForm = useCallback(
    (name = nameInput, image = imageInput, radio = selectedRadio) => {
      let isValid = true;
      const errors = {
        name: "",
        image: "",
        weather: "",
      };

      if (!name) {
        errors.name = "Name is required.";
        isValid = false;
      }
      if (!image) {
        errors.image = "Image URL is required.";
        isValid = false;
      }
      if (!radio) {
        errors.weather = "Please select a weather type.";
        isValid = false;
      }

      setErrorMessages(errors);
      setIsButtonDisabled(!isValid);
      return isValid;
    },
    [nameInput, imageInput, selectedRadio]
  );

  useEffect(() => {
    if (activeModal === "item-garment-modal") {
      validateForm();
    } else {
      resetForm();
    }
  }, [activeModal, selectedRadio]);

  const handleInputChange = () => {
    validateForm();
  };

  useEffect(() => {
    const fetchLocationAndWeather = async () => {
      let coords = null;

      const tryNavigatorGeolocation = () =>
        new Promise((resolve, reject) => {
          if (!navigator.geolocation) {
            reject(new Error("Geolocation not supported"));
          } else {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                resolve({
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                  source: "navigator",
                });
              },
              (error) => {
                reject(error);
              }
            );
          }
        });

      try {
        coords = await tryNavigatorGeolocation();
        setApiLocationError(null);
      } catch (error) {
        setApiLocationError(
          "For best accuracy, please enable browser location."
        );
        try {
          coords = await getClientIpGeolocation();
          setApiLocationError(null);
        } catch {
          try {
            coords = await getServerIpGeolocation();
            setApiLocationError(null);
          } catch {
            coords = DEFAULT_COORDS;
            setApiLocationError("Using default location");
          }
        }
      }

      try {
        const data = await getWeatherData(coords.latitude, coords.longitude);
        setWeatherData(data);
        setApiWeatherError(null);

        if (data.city && data.city !== "Unknown") {
          setApiLocationError(null);
        }
      } catch (error) {
        console.error("Weather fetch error:", error);
        setApiWeatherError("Failed to fetch weather for your location.");
      }
    };

    fetchLocationAndWeather();
  }, []);

  useEffect(() => {
    setClothingItems(defaultClothingItems);
  }, []);

  return (
    <div className="app">
      <CurrentTemperatureUnitContext.Provider
        value={{ currentTempUnit, handleTempUnitChange }}
      >
        <Header
          weatherData={weatherData}
          handleOpenAddGarmentModal={handleOpenAddGarmentModal}
          handleCloseModal={handleCloseModal}
          apiLocationError={apiLocationError}
        />
        <Main
          weatherData={weatherData}
          clothingItems={filteredClothingItems}
          tempCategory={tempCategory}
          handleOpenItemModal={handleOpenItemModal}
          handleCloseModal={handleCloseModal}
          apiWeatherError={apiWeatherError}
        />
        <Footer />
        <ItemModal
          card={selectedCard}
          isOpen={activeModal === "item-modal"}
          handleCloseModal={handleCloseModal}
        />
        <ModalWithForm
          isOpen={activeModal === "item-garment-modal"}
          title={"New garment"}
          buttonText={"Add Garment"}
          name={"add-garment-form"}
          isButtonDisabled={isButtonDisabled}
          handleSubmit={handleSubmit}
          errorMessages={errorMessages}
          handleCloseModal={handleCloseModal}
        >
          <fieldset className="modal__fieldset">
            <label
              htmlFor="input-add-garment-name"
              className="modal__label"
            ></label>
            Name
            <input
              id="input-add-garment-name"
              type="text"
              className="modal__input"
              placeholder="Name"
              value={nameInput}
              onChange={(e) => {
                setNameInput(e.target.value);
                validateForm(e.target.value, imageInput, selectedRadio);
              }}
            />
            {errorMessages.name && (
              <p className="modal__error-message">{errorMessages.name}</p>
            )}
            <label
              htmlFor="input-add-garment-image"
              className="modal__label"
            ></label>
            Image
            <input
              id="input-add-garment-image"
              type="url"
              className="modal__input"
              placeholder="Image URL"
              value={imageInput}
              onChange={(e) => {
                setImageInput(e.target.value);
                validateForm(nameInput, e.target.value, selectedRadio);
              }}
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
              const isSelected = selectedRadio === name.toLowerCase();
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
                    value={name.toLowerCase()}
                    checked={selectedRadio === name.toLowerCase()}
                    onChange={(e) => {
                      setSelectedRadio(e.target.value);
                      validateForm(nameInput, imageInput, e.target.value);
                    }}
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

          {apiError && (
            <p className="modal__error-message modal__error-message_api">
              {apiError}
            </p>
          )}
        </ModalWithForm>
      </CurrentTemperatureUnitContext.Provider>
    </div>
  );
}

export default App;
