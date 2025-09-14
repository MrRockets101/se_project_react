export const userPreferenceArray = [
  {
    unit: "F",
    categories: [
      { name: "cold", threshold: 0 },
      { name: "warm", threshold: 66 },
      { name: "hot", threshold: 86 },
    ],
  },
  {
    unit: "C",
    categories: [
      { name: "cold", threshold: 0 },
      { name: "warm", threshold: 19 },
      { name: "hot", threshold: 30 },
    ],
  },
];

// const unitConfig = userPreference.find(
//   (config) => config.unit === currentTempUnit
// );

// const categories = unitConfig ? unitConfig.categories.map((c) => c.name) : [];

// return (
//   <>
//     {categories.map((category) => (
//       <div key={category} className="modal__radio">
//         <input
//           className="modal__input-radio"
//           type="radio"
//           id={category}
//           name="weather"
//           value={category}
//           checked={selectedRadio === category}
//           onChange={handleRadioChange}
//         />
//         <label className="modal__label" htmlFor={category}>
//           {category.charAt(0).toUpperCase() + category.slice(1)}
//         </label>
//       </div>
//     ))}
//   </>
// );
