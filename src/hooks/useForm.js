import { useState, useCallback } from "react";

export function useForm(initialValues = {}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const validate = useCallback((v) => {
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

    return { errs, isValid };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedValues = { ...values, [name]: value };
    setValues(updatedValues);

    const { errs, isValid } = validate(updatedValues);

    setErrors(errs);
    setIsButtonDisabled(!isValid);
  };

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setIsButtonDisabled(true);
  }, [initialValues]);

  return {
    values,
    errors,
    handleChange,
    validate: () => validate(values).isValid,
    resetForm,
    isButtonDisabled,
  };
}
