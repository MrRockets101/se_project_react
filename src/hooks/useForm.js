import { useState, useCallback } from "react";
import { getErrorMessage } from "../utils/errorMessages";

export function useForm(initialValues = {}, customValidate = null) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({}); // Ensure errors is always an object
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const defaultValidate = (v, setErrs, setDisabled) => {
    const errs = {};
    let isValid = true;

    if (!v.name) {
      errs.name = getErrorMessage("required", "name");
      isValid = false;
    }
    if (!v.image) {
      errs.image = getErrorMessage("required", "image");
      isValid = false;
    }
    if (!v.weather) {
      errs.weather = getErrorMessage("required", "weather");
      isValid = false;
    }

    setErrs(errs);
    setDisabled(!isValid);
    return isValid;
  };

  const validate = useCallback(
    (v = values) => {
      const errs = {};
      let isValid = true;

      if (customValidate) {
        isValid = customValidate(v, setErrors, setIsButtonDisabled);
      } else {
        isValid = defaultValidate(v, setErrors, setIsButtonDisabled);
      }

      // Ensure errors is updated even if customValidate doesn't set it
      setErrors((prev) => ({ ...prev, ...errs }));
      setIsButtonDisabled(!isValid);
      return isValid;
    },
    [values, customValidate]
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedValues = { ...values, [name]: value };
    setValues(updatedValues);
    validate(updatedValues); // Trigger validation on change
  };

  const resetForm = useCallback(
    (preserveValues = {}) => {
      setValues((prev) => ({
        ...initialValues,
        ...preserveValues, // Preserve specific fields if provided
      }));
      setErrors({});
      setIsButtonDisabled(true);
    },
    [initialValues]
  );

  return {
    values,
    errors,
    handleChange,
    validate: () => validate(values),
    resetForm,
    isButtonDisabled,
  };
}
