import "../blocks/Index.css";
import { useContext } from "react";
import CurrentTemperatureUnitContext from "./CurrentTemperatureUnitContext";

function ToggleSwitch() {
  const { handleTempUnitChange, checked } = useContext(
    CurrentTemperatureUnitContext
  );

  return (
    <label className="toggle-switch" htmlFor="toggle-switch">
      <input
        id="toggle-switch"
        type="checkbox"
        className="toggle-switch__checkbox"
        checked={checked}
        onChange={handleTempUnitChange}
      />
      <span className="toggle-switch__circle"></span>
      <span className="toggle-switch__value toggle-switch__value_L">F</span>
      <span className="toggle-switch__value toggle-switch__value_R">C</span>
    </label>
  );
}

export default ToggleSwitch;
