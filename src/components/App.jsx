import { useState, useEffect, useRef, useCallback } from "react";

import { getItems, addItem } from "../utils/api";
import { useForm } from "../hooks/useForm";
import Profile from "./Profile";
import Header from "./Header";
//import main from "../main";
import Main from "./Main";
import Footer from "./footer";
//import { defaultClothingItems } from "../utils/defaultClothingItems";
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
//import Dashboard from "./Dashboard";
import AddItemModal from "./AddItemModal";
import { Route, Routes } from "react-router-dom";

function App() {
  const [clothingItems, setClothingItems] = useState([]);
  const [activeModal, setActiveModal] = useState("");
  const [selectedCard, setSelectedCard] = useState({});
  const { values, handleChange, setValues } = useForm({
    name: "",
    image: "",
    weather: "",
  });
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

  const formValidation = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("Form submitted successfully");
      }, 1000);
    });
  };
  const resetForm = () => {
    setValues({ name: "", image: "", weather: "" });
    setErrorMessages({ name: "", image: "", weather: "" });
    setIsButtonDisabled(true);
  };

  const generateUniqueId = () => {
    if (clothingItems.length === 0) return "1";

    const numericIds = clothingItems
      .map((item) => parseInt(item._id))
      .filter((id) => !isNaN(id));

    const maxId = Math.max(...numericIds);
    return (maxId + 1).toString();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setApiError("");

    if (!validateForm()) return;

    try {
      const response = await formValidation();
      console.log("Form submitted successfully:", response);

      const newItem = {
        _id: generateUniqueId(),
        name: values.name,
        imageUrl: values.image,
        weather: values.weather.toLowerCase(),
      };

      const savedItem = await addItem(newItem);
      setClothingItems((prevItems) => [...prevItems, savedItem]);

      handleCloseModal();
      resetForm();
    } catch (error) {
      console.error("Failed to submit:", error);
      setApiError(error.message || "Failed to submit.");
    }
  };

  const validateForm = useCallback(() => {
    let isValid = true;
    const errors = { name: "", image: "", weather: "" };

    if (!values.name) {
      errors.name = "Name is required.";
      isValid = false;
    }

    if (!values.image) {
      errors.image = "Image URL is required.";
      isValid = false;
    }

    if (!values.weather) {
      errors.weather = "Please select a weather type.";
      isValid = false;
    }

    setErrorMessages(errors);
    setIsButtonDisabled(!isValid);
    return isValid;
  }, [values]);

  useEffect(() => {
    if (activeModal === "item-garment-modal") {
      validateForm();
    }
  }, [values, activeModal]);

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
    getItems()
      .then((items) => {
        console.log("Fetched items:", items);
        setClothingItems(items);
      })
      .catch(console.error);
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
        <Routes>
          <Route
            path="/"
            element={
              <Main
                weatherData={weatherData}
                clothingItems={filteredClothingItems}
                tempCategory={tempCategory}
                handleOpenItemModal={handleOpenItemModal}
                handleCloseModal={handleCloseModal}
                apiWeatherError={apiWeatherError}
              />
            }
          />
          <Route
            path="/Profile"
            element={
              <Profile
                clothingItems={clothingItems}
                handleOpenItemModal={handleOpenItemModal}
                handleOpenAddGarmentModal={handleOpenAddGarmentModal}
              />
            }
          />
        </Routes>

        <Footer />
        <ItemModal
          card={selectedCard}
          isOpen={activeModal === "item-modal"}
          handleCloseModal={handleCloseModal}
        />

        <AddItemModal
          isOpen={activeModal === "item-garment-modal"}
          title="Add New Garment"
          buttonText="Add Garment"
          name="add-garment-form"
          handleSubmit={handleSubmit}
          handleCloseModal={handleCloseModal}
          isButtonDisabled={isButtonDisabled}
          errorMessages={errorMessages}
          values={values}
          handleChange={handleChange}
          apiError={apiError}
          categories={categories}
        />
      </CurrentTemperatureUnitContext.Provider>
    </div>
  );
}

export default App;
