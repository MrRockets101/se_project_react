import { useState, useCallback } from "react";

export function useFormValidation(initialValues = {}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const validate = useCallback(
    (v = values) => {
      const errs = {};
      let isValid = true;

      if (!v.name) {
        errs.name = "Name is required.";
        isValid = false;
      }
      if (!v.image) {
        errs.image = "Image URL is required.";
        isValid = false;
      }
      if (!v.weather) {
        errs.weather = "Please select a weather type.";
        isValid = false;
      }

      setErrors(errs);
      setIsButtonDisabled(!isValid);
      return isValid;
    },
    [values]
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedValues = { ...values, [name]: value };
    setValues(updatedValues);
    validate(updatedValues);
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setIsButtonDisabled(true);
  };

  return {
    values,
    errors,
    handleChange,
    validate,
    resetForm,
    isButtonDisabled,
  };
}
