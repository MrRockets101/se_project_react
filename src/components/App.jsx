import { useState, useEffect, useRef, useCallback } from "react";

import { getItems, addItem, deleteItem } from "../utils/api";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import Profile from "./Profile";
import Header from "./Header";
import Main from "./Main";
import Footer from "./footer";
import ItemModal from "./ItemModal";
import "../index.css";
import CurrentTemperatureUnitContext from "../utils/CurrentTemperatureUnitContext";
import { userPreferenceArray } from "../utils/userPreferenceArray";
import { getTempCategory } from "../utils/getTempCategory";
import AddItemModal from "./AddItemModal";
import { Route, Routes } from "react-router-dom";
import { useWeatherLocation } from "../hooks/useWeatherLocation";
import { useFormValidation } from "../hooks/useFormValidation";
import LocationModal from "./LocationModal";

function App() {
  const [clothingItems, setClothingItems] = useState([]);
  const [activeModal, setActiveModal] = useState("");
  const [selectedCard, setSelectedCard] = useState({});
  const [locationModalOpen, setLocationModalOpen] = useState(false);

  const handleOpenLocationModal = () => setLocationModalOpen(true);
  const handleCloseLocationModal = () => setLocationModalOpen(false);
  const handleUpdateLocation = async ({ latitude, longitude }) => {
    try {
      await updateLocation({ latitude, longitude });
      setLocationModalOpen(false);
    } catch {
      setApiLocationError("Failed to update location.");
    }
  };

  const { weatherData, apiWeatherError, apiLocationError, updateLocation } =
    useWeatherLocation();

  const [apiError, setApiError] = useState("");

  const [currentTempUnit, setCurrentTempUnit] = useState("F");
  const temp = weatherData?.temp?.[currentTempUnit] ?? null;

  const tempCategory =
    temp !== null
      ? getTempCategory(temp, currentTempUnit, userPreferenceArray)
      : "unknown";

  const filteredClothingItems =
    tempCategory === "unknown"
      ? clothingItems
      : clothingItems.filter(
          (item) => item.weather.toLowerCase() === tempCategory.toLowerCase()
        );

  const unitConfig = userPreferenceArray.find(
    (config) => config.unit === currentTempUnit
  );

  const prevTempUnit = useRef();

  useEffect(() => {
    if (prevTempUnit.current && prevTempUnit.current !== currentTempUnit) {
      console.log(
        `Temp unit changed from ${prevTempUnit.current} to ${currentTempUnit}`
      );
    }
    prevTempUnit.current = currentTempUnit;
  }, [currentTempUnit]);

  const categories = unitConfig ? unitConfig.categories : [];

  const generateUniqueId = () => {
    if (clothingItems.length === 0) return "1";

    const numericIds = clothingItems
      .map((item) => parseInt(item._id))
      .filter((id) => !isNaN(id));

    const maxId = Math.max(...numericIds);
    return (maxId + 1).toString();
  };
  const [itemToDelete, setItemToDelete] = useState(null);
  const handleDeleteItem = (card) => {
    setItemToDelete(card); // store item to delete
    setActiveModal("confirm-delete");
  };
  const handleConfirmDelete = async () => {
    try {
      console.log("Deleting item with ID:", itemToDelete?._id, itemToDelete);

      await deleteItem(itemToDelete._id);
      setClothingItems((prev) =>
        prev.filter((item) => item._id !== itemToDelete._id)
      );
      setItemToDelete(null);
      handleCloseModal();
    } catch (err) {
      console.error("Failed to delete item", err);
      alert("Failed to delete item.");
    }
  };
  const {
    values,
    errors: errorMessages,
    handleChange,
    validate,
    resetForm,
    isButtonDisabled,
  } = useFormValidation({
    name: "",
    image: "",
    weather: "",
  });
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setApiError("");

    if (!validate()) return;

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

  useEffect(() => {
    if (activeModal === "item-garment-modal") {
      validate();
    }
  }, [values, activeModal]);

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
          handleOpenLocationModal={handleOpenLocationModal}
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
          handleDeleteItem={handleDeleteItem}
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
        <ConfirmDeleteModal
          isOpen={activeModal === "confirm-delete"}
          onClose={handleCloseModal}
          onConfirm={handleConfirmDelete}
        />
        {locationModalOpen && (
          <LocationModal
            onClose={handleCloseLocationModal}
            onUpdateLocation={handleUpdateLocation}
          />
        )}
      </CurrentTemperatureUnitContext.Provider>
    </div>
  );
}

export default App;
