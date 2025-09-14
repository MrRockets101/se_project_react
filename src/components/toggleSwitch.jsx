import "../blocks/Index.css";
import { useContext } from "react";
import CurrentTemperatureUnitContext from "../utils/CurrentTemperatureUnitContext";

function ToggleSwitch() {
  const { handleTempUnitChange, currentTempUnit } = useContext(
    CurrentTemperatureUnitContext
  );
  const isChecked = currentTempUnit === "C";

  return (
    <label className="toggle-switch" htmlFor="toggle-switch">
      <input
        id="toggle-switch"
        type="checkbox"
        className="toggle-switch__checkbox"
        checked={isChecked}
        onChange={handleTempUnitChange}
      />
      <span className="toggle-switch__circle"></span>
      <span className="toggle-switch__value toggle-switch__value_L">F</span>
      <span className="toggle-switch__value toggle-switch__value_R">C</span>
    </label>
  );
}

export default ToggleSwitch;
