import { useState, useCallback, useRef, useEffect } from "react";
import "../blocks/App.css";
import Header from "./Header";
import Main from "./main";
import Footer from "./footer";
import { defaultClothingItems } from "../utils/defaultClothingItems";
import ItemModal from "./ItemModal";
import ModalWithForm from "./ModalWithForm";
import "../blocks/Index.css";
function App() {
  const [clothingItems, setClothingItems] = useState(defaultClothingItems);
  const [activeModal, setActiveModal] = useState("");
  // use state -> useForm
  const [selectedCard, setSelectedCard] = useState({});
  const [selectedRadio, setSelectedRadio] = useState("");
  const [errorMessages, setErrorMessages] = useState({
    name: "",
    image: "",
    weather: "",
  });
  const [apiError, setApiError] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const nameInputRef = useRef(null);
  const imageInputRef = useRef(null);

  function handleOpenItemModal(card) {
    setActiveModal("item-modal");
    setSelectedCard(card);
  }

  function handleOpenAddGarmentModal() {
    setActiveModal("item-garment-modal");
    setApiError("");
  }

  function handleCloseModal() {
    setActiveModal("");
    setApiError("");
  }

  function handleRadioChange(event) {
    setSelectedRadio(event.target.value);
    validateForm();
  }

  const ApiCall = () => {
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
      const response = await ApiCall();
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

  return (
    <div className="app">
      <Header
        handleOpenAddGarmentModal={handleOpenAddGarmentModal}
        handleCloseModal={handleCloseModal}
      />
      <Main
        clothingItems={clothingItems}
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
          <div className="modal__radio">
            <input
              className="modal__input-radio"
              type="radio"
              id="Hot"
              name="weather"
              value="Hot"
              checked={selectedRadio === "Hot"}
              onChange={handleRadioChange}
            />
            <label className="modal__label" htmlFor="Hot">
              Hot
            </label>
          </div>
          <div className="modal__radio">
            <input
              className="modal__input-radio"
              type="radio"
              id="Warm"
              name="weather"
              value="Warm"
              checked={selectedRadio === "Warm"}
              onChange={handleRadioChange}
            />
            <label className="modal__label" htmlFor="Warm">
              Warm
            </label>
          </div>
          <div className="modal__radio">
            <input
              className="modal__input-radio"
              type="radio"
              id="Cold"
              name="weather"
              value="Cold"
              checked={selectedRadio === "Cold"}
              onChange={handleRadioChange}
            />
            <label className="modal__label" htmlFor="Cold">
              Cold
            </label>
          </div>
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
    </div>
  );
}

export default App;
