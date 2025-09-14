import { useState, useEffect, useRef, useCallback } from "react";
import "../blocks/App.css";
import Header from "./Header";
import Main from "./main";
import Footer from "./footer";
import { defaultClothingItems } from "../utils/defaultClothingItems";
import ItemModal from "./ItemModal";
import ModalWithForm from "./ModalWithForm";
import "../blocks/Index.css";
import { getWeatherData } from "../utils/weatherApi";
import CurrentTemperatureUnitContext from "./CurrentTemperatureUnitContext";
import { userPreferenceArray } from "../utils/userPreferenceArray";
import { getTempCategory } from "../utils/getTempCategory";

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
  const nameInputRef = useRef(null);
  const imageInputRef = useRef(null);
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
    setSelectedRadio("");
    setErrorMessages({ name: "", image: "", weather: "" });
    setIsButtonDisabled(true);
    if (nameInputRef.current) nameInputRef.current.value = "";
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setApiError("");
    try {
      const response = await formValidation();
      console.log("Form submitted successfully:", response);
      handleCloseModal();

      setSelectedRadio("");
      resetForm();
    } catch (error) {
      console.error("Error submitting form:", error);

      setApiError(error.message || "An error occurred during submission.");
    }
  };

  const validateForm = useCallback(() => {
    const nameInput = nameInputRef.current;
    const imageInput = imageInputRef.current;
    let isValid = true;
    const errors = {
      name: "",
      image: "",
      weather: "",
    };

    if (!nameInput?.value) {
      errors.name = "Name is required.";
      isValid = false;
    }
    if (!imageInput?.value) {
      errors.image = "Image URL is required.";
      isValid = false;
    }
    if (!selectedRadio) {
      errors.weather = "Please select a weather type.";
      isValid = false;
    }

    setErrorMessages(errors);
    setIsButtonDisabled(!isValid);
    return isValid;
  }, [selectedRadio]);

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
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const data = await getWeatherData(latitude, longitude);
            setWeatherData(data);
          } catch (error) {
            console.error("Error fetching weather data:", error);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
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
        />
        <Main
          weatherData={weatherData}
          clothingItems={filteredClothingItems}
          tempCategory={tempCategory}
          handleOpenItemModal={handleOpenItemModal}
          handleCloseModal={handleCloseModal}
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
              ref={nameInputRef}
              onChange={handleInputChange}
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
              ref={imageInputRef}
              onChange={handleInputChange}
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
                    onChange={handleRadioChange}
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
