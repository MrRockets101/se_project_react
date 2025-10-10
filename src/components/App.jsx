import { useState, useEffect, useRef, useCallback } from "react";
import {
  getItems,
  addItem,
  deleteItem,
  register,
  login,
  getCurrentUser,
  updateCurrentUser,
  likeItem,
  unlikeItem,
} from "../utils/api";
import { BASE_URL } from "../utils/constants";
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
import ErrorModal from "./ErrorModal";
import RegistrationSuccessModal from "./RegistrationSuccessModal";

function ProtectedRoute({ children, isLoggedIn }) {
  return isLoggedIn ? children : <Navigate to="/" />;
}

function App() {
  const [activeModal, setActiveModal] = useState("");
  const [selectedCard, setSelectedCard] = useState({});

  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [apiError, setApiError] = useState("");
  const [errorType, setErrorType] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorTriggerModal, setErrorTriggerModal] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const resetFormRef = useRef(null);
  // location logic
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const handleOpenLocationModal = () => setLocationModalOpen(true);
  const handleCloseLocationModal = () => setLocationModalOpen(false);
  const handleUpdateLocation = async ({ latitude, longitude }) => {
    try {
      await updateLocation({ latitude, longitude });
      setLocationModalOpen(false);
    } catch (error) {
      console.error("Update location error:", error);
      setApiError(error.message);
      setErrorType(error.type || "api");
      setShowErrorModal(true);
      setErrorTriggerModal("location");
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
  const [clothingItems, setClothingItems] = useState([]);
  const filteredClothingItems =
    tempCategory === "unknown"
      ? clothingItems
      : clothingItems.filter(
          (item) =>
            item.weather &&
            typeof item.weather === "string" &&
            item.weather.toLowerCase() === tempCategory.toLowerCase()
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
    } catch (error) {
      console.error("Delete item error:", error);
      setApiError(error.message);
      setErrorType(error.type || "api");
      setShowErrorModal(true);
      setErrorTriggerModal("confirm-delete");
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
  };

  const handleOpenRegisterModal = () => {
    setActiveModal("register");
  };

  const handleOpenLoginModal = () => {
    setActiveModal("login");
  };

  const handleOpenEditProfileModal = () => {
    if (!isLoggedIn) {
      setActiveModal("login");
      return;
    }
    setActiveModal("edit-profile");
  };

  const handleTempUnitChange = () => {
    setCurrentTempUnit(currentTempUnit === "F" ? "C" : "F");
  };

  const handleCloseModal = () => {
    setActiveModal("");
    setShowSuccessModal(false);
  };

  const handleRegister = async (values) => {
    try {
      await register(values);
      await handleLogin({ email: values.email, password: values.password });
      setShowSuccessModal(true);
      handleCloseModal();
    } catch (error) {
      console.error("Register error:", error);
      setApiError(error.message);
      setErrorType(error.type || "api");
      setShowErrorModal(true);
      setErrorTriggerModal("register");
    }
  };

  const handleLogin = async (values) => {
    try {
      const response = await login(values);
      if (response.data?.token) {
        localStorage.setItem("jwt", response.data.token);
        await checkToken();
        handleCloseModal();
      } else {
        throw new Error("Login failed: No token received");
      }
    } catch (error) {
      console.error("Login error:", error);
      setApiError(error.message);
      setErrorType(error.type || "api");
      setShowErrorModal(true);
      setErrorTriggerModal("login");
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
      setCurrentUser(updatedUser.data);
      handleCloseModal();
    } catch (error) {
      console.error("Edit profile error:", error);
      setApiError(error.message);
      setErrorType(error.type || "api");
      setShowErrorModal(true);
      setErrorTriggerModal("edit-profile");
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
      setClothingItems((prev) => [savedItem.data, ...prev]);
      handleCloseModal();
    } catch (error) {
      console.error("Add item error:", error);
      setApiError(error.message);
      setErrorType(error.type || "api");
      setShowErrorModal(true);
      setErrorTriggerModal("item-garment-modal");
    }
  };

  const handleCardLike = async ({ _id, likes }) => {
    if (!isLoggedIn) {
      setActiveModal("login");
      return;
    }

    const isLiked = likes?.some((id) => id === currentUser?._id) ?? false;
    const apiCall = isLiked ? unlikeItem : likeItem;

    try {
      const response = await apiCall(_id);
      const updatedItem = response.data;
      setClothingItems((prev) =>
        prev.map((item) => (item._id === _id ? updatedItem : item))
      );
    } catch (err) {
      console.error("Like/Unlike error:", err);
      setApiError(err.message);
      setErrorType(err.type || "api");
      setShowErrorModal(true);
      setErrorTriggerModal("like");
    }
  };

  const checkToken = useCallback(async () => {
    const token = localStorage.getItem("jwt");
    if (token) {
      try {
        const user = await getCurrentUser();
        console.log("Current user fetched:", user.data);
        setCurrentUser(user.data);
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
        console.log("Fetching clothing items from:", `${BASE_URL}/items`);
        const items = await getItems();
        console.log("Items response:", items);
        if (Array.isArray(items)) {
          setClothingItems(items);
          console.log("Clothing items set:", items);
        } else {
          console.warn("Items response is not an array:", items);
          setClothingItems([]);
        }
      } catch (error) {
        console.error(
          "Fetch items error:",
          error,
          "Message:",
          error.message,
          "Type:",
          error.type,
          "Stack:",
          error.stack
        );
        setApiError(error.message);
        setErrorType(error.type || "api");
        setErrorTriggerModal("fetch-items");
        console.log(
          "ErrorModal triggered with:",
          error.message,
          error.type,
          "fetch-items"
        );
        setShowErrorModal(true);
      }
    };
    fetchItems();
  }, []);

  // Debug weather and filtering
  useEffect(() => {
    console.log("weatherData:", weatherData);
    console.log("temp:", temp);
    console.log("tempCategory:", tempCategory);
    console.log("clothingItems:", clothingItems);
    console.log("filteredClothingItems:", filteredClothingItems);
    console.log("currentUser:", currentUser);
  }, [
    weatherData,
    temp,
    tempCategory,
    clothingItems,
    filteredClothingItems,
    currentUser,
  ]);

  const handleErrorModalClose = () => {
    setShowErrorModal(false);
    if (errorTriggerModal !== "register") {
      setApiError("");
      setErrorType("");
    }
    if (errorTriggerModal === "register" && resetFormRef.current) {
      resetFormRef.current({ password: "" });
      if (activeModal !== "register") {
        setActiveModal("register");
      }
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
  };

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="app">
        <CurrentTemperatureUnitContext.Provider
          value={{ currentTempUnit, handleTempUnitChange }}
        >
          <Header
            weatherData={weatherData}
            handleOpenAddGarmentModal={handleOpenAddGarmentModal}
            apiLocationError={apiLocationError}
            handleOpenLocationModal={handleOpenLocationModal}
            handleOpenRegisterModal={handleOpenRegisterModal}
            handleOpenLoginModal={handleOpenLoginModal}
            isAuthenticated={isLoggedIn}
            handleSignOut={handleSignOut}
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
                  apiWeatherError={apiWeatherError}
                  onCardLike={handleCardLike}
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
                    handleSignOut={handleSignOut}
                    handleOpenEditProfileModal={handleOpenEditProfileModal}
                    onCardLike={handleCardLike}
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
            onSwitchToLogin={handleOpenLoginModal}
            resetFormRef={resetFormRef}
          />
          <LoginModal
            isOpen={activeModal === "login"}
            handleCloseModal={handleCloseModal}
            handleSubmit={handleLogin}
            apiError={apiError}
            setApiError={setApiError}
            onSwitchToRegister={handleOpenRegisterModal}
          />
          <EditProfileModal
            isOpen={activeModal === "edit-profile"}
            handleCloseModal={handleCloseModal}
            handleSubmit={handleEditProfile}
            apiError={apiError}
            setApiError={setApiError}
          />
          <ConfirmDeleteModal
            isOpen={activeModal === "confirm-delete"}
            onClose={handleCloseModal}
            onConfirm={handleConfirmDelete}
            apiError={apiError}
            setApiError={setApiError}
          />
          <LocationModal
            isOpen={locationModalOpen}
            onClose={handleCloseLocationModal}
            onUpdateLocation={handleUpdateLocation}
          />
          <ErrorModal
            isOpen={showErrorModal}
            message={apiError}
            errorType={errorType}
            onClose={handleErrorModalClose}
            errorTriggerModal={errorTriggerModal}
          />
          <RegistrationSuccessModal
            isOpen={showSuccessModal}
            title="Registration Successful"
            message="You have successfully registered!"
            onClose={handleSuccessModalClose}
          />
        </CurrentTemperatureUnitContext.Provider>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
