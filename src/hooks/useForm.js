import { useState, useCallback, useEffect } from "react";
import { getErrorMessage } from "../utils/errorMessage";

export function useForm(
  initialValues = {},
  customValidate = null,
  externalValues = null,
  onValuesChange,
  onFieldChangeCallback // New prop to handle additional logic on change
) {
  const [values, setValues] = useState(externalValues || initialValues); // Use external values if provided
  const [errors, setErrors] = useState({}); // Ensure errors is always an object
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [submitSuccess, setSubmitSuccess] = useState(false); // Track submission success

  // Notify parent of values change
  useEffect(() => {
    if (onValuesChange) {
      onValuesChange(values);
    }
  }, [values, onValuesChange]);

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

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      const updatedValues = { ...values, [name]: value };
      setValues(updatedValues);
      validate(updatedValues); // Trigger validation on change
      if (onFieldChangeCallback) {
        onFieldChangeCallback(); // Call callback to clear localApiError
      }
    },
    [values, validate, onFieldChangeCallback]
  );

  const resetForm = useCallback(
    (preserveValues = {}, externalValues = null) => {
      if (submitSuccess) {
        setValues((prev) => ({
          ...initialValues,
          ...preserveValues, // Preserve specific fields if provided
        }));
        setErrors({});
        setIsButtonDisabled(true);
        setSubmitSuccess(false); // Reset success flag after reset
      } else {
        // On failure, use externalValues if provided, then apply preserveValues
        setValues((prev) => ({
          ...(externalValues || prev),
          ...preserveValues,
        }));
        setErrors({});
        validate(); // Re-validate to update isButtonDisabled
      }
    },
    [initialValues, submitSuccess, validate]
  );

  return {
    values,
    errors,
    handleChange,
    validate: () => validate(values),
    resetForm,
    isButtonDisabled,
    setSubmitSuccess, // Expose this to trigger reset on success
  };
}
