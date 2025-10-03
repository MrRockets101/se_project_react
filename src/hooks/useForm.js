import { useState, useCallback } from "react";

export function useForm(initialValues = {}, customValidate = null) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({}); // Ensure errors is always an object
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const defaultValidate = (v, setErrs, setDisabled) => {
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

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setIsButtonDisabled(true);
  }, [initialValues]);

  return {
    values,
    errors,
    handleChange,
    validate: () => validate(values),
    resetForm,
    isButtonDisabled,
  };
}
