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
    generic: "Failed to register.",
  },
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
  if (customMessage) return customMessage; // Allow overriding with API message
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
    default:
      return "An error occurred.";
  }
};
