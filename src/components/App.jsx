import { useState } from "react";

import "../blocks/App.css";
import Header from "./Header";
import Main from "./main";
import Footer from "./footer";
import { defaultClothingItems } from "../utils/defaultClothingItems";
import ItemModal from "./ItemModal";
import ModalWithForm from "./ModalWithForm";

function App() {
  const [clothingItems, setClothingItems] = useState(defaultClothingItems);
  const [activeModal, setActiveModal] = useState("");
  const [selectedCard, setSelectedCard] = useState({});

  function handleOpenItemModal(card) {
    setActiveModal("item-modal");
    setSelectedCard(card);
  }

  function handleOpenAddGarmentModal() {
    setActiveModal("item-garment-modal");
  }
  function handleCloseModal() {
    setActiveModal("");
  }

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
      >
        <fieldset className="modal__fieldset">
          <label
            htmlFor="input-add-garment-name"
            className="modal__label"
          ></label>
          Name
          <input
            id="input-add-garment-name"
            type="name"
            className="modal__input"
            placeholder="Name"
          />
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
          />
        </fieldset>
        <fieldset className="modal__fieldset">
          <legend>Select weather type:</legend>

          <div>
            <input
              className="modal__input-radio"
              type="radio"
              id="Hot"
              name="weather"
              value="Hot"
            />
            <label className="modal__label" htmlFor="Hot">
              Hot
            </label>
          </div>

          <div>
            <input
              className="modal__input-radio"
              type="radio"
              id="Warm"
              name="weather"
              value="Warm"
            />
            <label className="modal__label" htmlFor="Warm">
              Warm
            </label>
          </div>

          <div>
            <input
              className="modal__input-radio"
              type="radio"
              id="Cold"
              name="weather"
              value="Cold"
            />
            <label className="modal__label" htmlFor="Cold">
              Cold
            </label>
          </div>
        </fieldset>
      </ModalWithForm>
    </div>
  );
}

export default App;
{
  /* 
  function App() {
  const [count, setCount] = useState(0);
  <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p> */
}
