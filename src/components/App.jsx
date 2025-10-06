import { useState, useEffect, useRef, useCallback } from "react";
import {
  getItems,
  addItem,
  deleteItem,
  register,
  login,
  getCurrentUser,
  updateCurrentUser,
  updateItem,
} from "../utils/api";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import Profile from "./Profile";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import ItemModal from "./ItemModal";
import RegisterModal from "./RegisterModal";
import LoginModal from "./LoginModal";
import EditProfileModal from "./EditProfileModal";
import "../index.css";
import CurrentTemperatureUnitContext from "../utils/CurrentTemperatureUnitContext";
import { userPreferenceArray } from "../utils/userPreferenceArray";
import { getTempCategory } from "../utils/getTempCategory";
import AddItemModal from "./AddItemModal";
import { Route, Routes, Navigate } from "react-router-dom";
import { useWeatherLocation } from "../hooks/useWeatherLocation";
import LocationModal from "./LocationModal";
import CurrentUserContext from "../Context/CurrentUserContext";
import ErrorBoundary from "./ErrorBoundary";
import ErrorModal from "./ErrorModal"; // Import the updated modal

function ProtectedRoute({ children, isLoggedIn }) {
  return isLoggedIn ? children : <Navigate to="/" />;
}

function App() {
  const [clothingItems, setClothingItems] = useState([]);
  const [activeModal, setActiveModal] = useState("");
  const [selectedCard, setSelectedCard] = useState({});
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [apiError, setApiError] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false); // New state for error modal

  const handleOpenLocationModal = () => setLocationModalOpen(true);
  const handleCloseLocationModal = () => setLocationModalOpen(false);
  const handleUpdateLocation = async ({ latitude, longitude }) => {
    try {
      await updateLocation({ latitude, longitude });
      setLocationModalOpen(false);
    } catch (error) {
      console.error("Failed to update location:", error);
      setApiError(error.message || "Failed to update location.");
      setShowErrorModal(true); // Trigger error modal on failure
    }
  };

  const { weatherData, apiWeatherError, apiLocationError, updateLocation } =
    useWeatherLocation();

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

  const [itemToDelete, setItemToDelete] = useState(null);

  const handleDeleteItem = (card) => {
    if (!isLoggedIn) {
      setActiveModal("login");
      return;
    }
    setItemToDelete(card);
    setActiveModal("confirm-delete");
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteItem(itemToDelete._id);
      setClothingItems((prev) =>
        prev.filter((item) => item._id !== itemToDelete._id)
      );
      setItemToDelete(null);
      handleCloseModal();
      setApiError("");
    } catch (error) {
      console.error("Failed to delete item:", error);
      setApiError(error.message); // e.g., "You can only delete your own items"
      setShowErrorModal(true); // Trigger error modal on failure
    }
  };

  const handleOpenItemModal = (card) => {
    setActiveModal("item-modal");
    setSelectedCard(card);
  };

  const handleOpenAddGarmentModal = () => {
    if (!isLoggedIn) {
      setActiveModal("login");
      return;
    }
    setActiveModal("item-garment-modal");
    setApiError("");
  };

  const handleOpenRegisterModal = () => {
    setActiveModal("register");
    setApiError("");
  };

  const handleOpenLoginModal = () => {
    setActiveModal("login");
    setApiError("");
  };

  const handleOpenEditProfileModal = () => {
    if (!isLoggedIn) {
      setActiveModal("login");
      return;
    }
    setActiveModal("edit-profile");
    setApiError("");
  };

  const handleTempUnitChange = () => {
    setCurrentTempUnit(currentTempUnit === "F" ? "C" : "F");
  };

  const handleCloseModal = () => {
    setActiveModal("");
    setApiError("");
  };

  const handleRegister = async (values) => {
    try {
      const user = await register(values);
      setCurrentUser(user);

      const loginResponse = await login({
        email: values.email,
        password: values.password,
      });
      localStorage.setItem("jwt", loginResponse.token);
      setIsLoggedIn(true);
      handleCloseModal();
    } catch (error) {
      console.error("Registration failed:", error);
      setApiError(error.message);
      setShowErrorModal(true);
    }
  };

  const handleLogin = async (values) => {
    try {
      const response = await login(values);
      localStorage.setItem("jwt", response.token);
      const user = await getCurrentUser();
      setCurrentUser(user);
      setIsLoggedIn(true);
      handleCloseModal();
    } catch (error) {
      console.error("Login failed:", error);
      setApiError(error.message);
      setShowErrorModal(true);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("jwt");
    setCurrentUser(null);
    setIsLoggedIn(false);
  };

  const handleEditProfile = async (values) => {
    try {
      const updatedUser = await updateCurrentUser(values);
      setCurrentUser(updatedUser);
      handleCloseModal();
    } catch (error) {
      console.error("Profile update failed:", error);
      setApiError(error.message);
      setShowErrorModal(true);
    }
  };

  const handleSubmitAddItem = async (values) => {
    if (!isLoggedIn) {
      throw new Error("You must be logged in to add items.");
    }
    try {
      const newItem = {
        name: values.name,
        imageUrl: values.image,
        weather: values.weather.toLowerCase(),
      };
      const savedItem = await addItem(newItem);
      setClothingItems((prev) => [savedItem, ...prev]);
      handleCloseModal();
    } catch (error) {
      console.error("Failed to add item:", error);
      setApiError(error.message);
      setShowErrorModal(true);
    }
  };

  const checkToken = useCallback(async () => {
    const token = localStorage.getItem("jwt");
    if (token) {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user);
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Token validation failed:", error);
        localStorage.removeItem("jwt");
        setIsLoggedIn(false);
        setCurrentUser(null);
      }
    } else {
      setIsLoggedIn(false);
      setCurrentUser(null);
    }
  }, []);

  useEffect(() => {
    checkToken();
  }, [checkToken]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const items = await getItems();
        console.log("Fetched items response:", items);
        if (Array.isArray(items)) {
          setClothingItems(items);
        } else {
          console.warn("Items response is not an array:", items);
          setClothingItems([]);
        }
      } catch (error) {
        console.error("Error fetching items:", error);
        setApiError(error.message);
        setClothingItems([]);
      }
    };
    fetchItems();
  }, []);

  return (
    <CurrentUserContext.Provider value={currentUser}>
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
            handleOpenRegisterModal={handleOpenRegisterModal}
            handleOpenLoginModal={handleOpenLoginModal}
            isLoggedIn={isLoggedIn}
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
              path="/profile"
              element={
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                  <Profile
                    clothingItems={clothingItems}
                    handleOpenItemModal={handleOpenItemModal}
                    handleOpenAddGarmentModal={handleOpenAddGarmentModal}
                    currentUser={currentUser}
                    handleSignOut={handleSignOut}
                    handleOpenEditProfileModal={handleOpenEditProfileModal}
                  />
                </ProtectedRoute>
              }
            />
          </Routes>
          <Footer />
          <ItemModal
            card={selectedCard}
            isOpen={activeModal === "item-modal"}
            handleCloseModal={handleCloseModal}
            handleDeleteItem={handleDeleteItem}
            apiError={apiError}
            setApiError={setApiError}
          />
          <AddItemModal
            isOpen={activeModal === "item-garment-modal"}
            handleCloseModal={handleCloseModal}
            title="Add New Garment"
            buttonText="Add Garment"
            name="add-garment-form"
            categories={categories}
            apiError={apiError}
            setApiError={setApiError}
            handleSubmit={handleSubmitAddItem}
          />
          <RegisterModal
            isOpen={activeModal === "register"}
            handleCloseModal={handleCloseModal}
            handleSubmit={handleRegister}
            apiError={apiError}
            setApiError={setApiError}
            onSwitchToLogin={() => setActiveModal("login")}
          />
          <LoginModal
            isOpen={activeModal === "login"}
            handleCloseModal={handleCloseModal}
            handleSubmit={handleLogin}
            apiError={apiError}
            setApiError={setApiError}
            onSwitchToRegister={() => setActiveModal("register")}
          />
          <EditProfileModal
            isOpen={activeModal === "edit-profile"}
            handleCloseModal={handleCloseModal}
            handleSubmit={handleEditProfile}
            apiError={apiError}
            setApiError={setApiError}
            currentUser={currentUser}
          />
          <ConfirmDeleteModal
            isOpen={activeModal === "confirm-delete"}
            onClose={handleCloseModal}
            onConfirm={handleConfirmDelete}
            apiError={apiError}
            setApiError={setApiError}
          />
          {locationModalOpen && (
            <LocationModal
              onClose={handleCloseLocationModal}
              onUpdateLocation={handleUpdateLocation}
              apiError={apiError}
              setApiError={setApiError}
            />
          )}
          <ErrorModal
            isOpen={showErrorModal}
            message={apiError}
            title="Submission Error"
            onClose={() => setShowErrorModal(false)}
          />
        </CurrentTemperatureUnitContext.Provider>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
