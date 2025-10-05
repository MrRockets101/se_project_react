// src/utils/errorMappings.js
export const errorMappings = {
  400: "Bad request. Please check your input.", // Matches validation errors
  401: "Unauthorized. Please log in again.", // Matches invalid token or login
  403: "Forbidden. You don’t have permission to perform this action.", // Potential item deletion
  404: "Resource not found.", // Matches user not found
  409: "Email already exists.", // Matches duplicate email
  500: "Server error. Please try again later.", // Matches server errors
  default: "An unexpected error occurred. Please try again.",
};
