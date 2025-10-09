export const errorMessages = {
  required: (fieldName) => `${capitalize(fieldName)} is required.`,
  invalidFormat: {
    email: "Invalid email format.",
    url: "Invalid URL format.",
  },
  minLength: {
    password: "Password must be at least 6 characters.",
  },
  api: {
    emailExists: "Email already exists.",
    generic: "An error occurred while processing your request.",
  },
  validation: (message) =>
    message || "Invalid input. Please check the provided details.",
  network:
    "Unable to connect to the server. Please check your internet connection or try again.",
};

// Helper function to capitalize field names
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Export a utility function to get messages
export const getErrorMessage = (
  type,
  fieldName = null,
  customMessage = null
) => {
  if (customMessage) {
    // Handle celebrate validation messages directly
    if (type === "validation") {
      return errorMessages.validation(customMessage);
    }
    return customMessage;
  }
  switch (type) {
    case "required":
      return errorMessages.required(fieldName);
    case "invalidFormat":
      return errorMessages.invalidFormat[fieldName] || "Invalid format.";
    case "minLength":
      return errorMessages.minLength[fieldName] || "Minimum length not met.";
    case "apiEmailExists":
      return errorMessages.api.emailExists;
    case "apiGeneric":
      return errorMessages.api.generic;
    case "network":
      return errorMessages.network;
    case "validation":
      return errorMessages.validation(fieldName);
    default:
      return "An unexpected error occurred.";
  }
};

// New function to handle context-specific error messages
export const getContextErrorMessage = (
  errorType,
  message,
  errorTriggerModal
) => {
  // Handle celebrate validation errors
  if (errorType === "validation") {
    return getErrorMessage("validation", null, message);
  }

  switch (errorTriggerModal) {
    case "fetch-items":
      return getErrorMessage(
        errorType === "network" ? "network" : "apiGeneric",
        null,
        message ===
          "Unable to connect to the server. Please check your internet connection or try again later."
          ? message
          : "Failed to load clothing items. Please try again later."
      );
    case "register":
      return message.includes("email already exists")
        ? getErrorMessage("apiEmailExists")
        : getErrorMessage(
            "apiGeneric",
            null,
            "Registration failed. Please check your details."
          );
    case "login":
      return getErrorMessage(
        "apiGeneric",
        null,
        "Login failed. Please check your email and password."
      );
    case "item-garment-modal":
      return getErrorMessage(
        "apiGeneric",
        null,
        "Failed to add item. Please check the item details."
      );
    case "confirm-delete":
      return getErrorMessage(
        "apiGeneric",
        null,
        "Failed to delete item. Please try again."
      );
    case "like":
      return getErrorMessage(
        "apiGeneric",
        null,
        "Failed to update like status. Please try again."
      );
    case "edit-profile":
      return getErrorMessage(
        "apiGeneric",
        null,
        "Failed to update profile. Please check your details."
      );
    case "location":
      return getErrorMessage(
        "apiGeneric",
        null,
        "Failed to update location. Please try again."
      );
    default:
      return getErrorMessage(errorType || "apiGeneric", null, message);
  }
};
