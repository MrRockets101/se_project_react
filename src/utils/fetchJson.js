import { errorMappings } from "./errorMappings";

export async function fetchJson(
  url,
  options = { method: "GET" },
  errorMessage = "Request failed"
) {
  try {
    const token = localStorage.getItem("jwt");
    console.log(
      `Fetch request to: ${url}, Method: ${options.method}, Token: ${
        token || "none"
      }, Headers: ${JSON.stringify(options.headers || {})}`
    );

    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    console.log(
      `Fetch response for ${url}: Status ${
        response.status
      }, Headers: ${JSON.stringify(
        Object.fromEntries(response.headers.entries())
      )}`
    );

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = {};
        console.warn(`Failed to parse error response for ${url}:`, e);
      }
      const backendMessage = errorData.message || errorMessage;
      const error = new Error(backendMessage);
      error.status = response.status;

      // Handle celebrate validation errors
      if (
        errorData.details &&
        Array.isArray(errorData.details) &&
        errorData.details[0]?.message
      ) {
        error.message = errorData.details[0].message; // e.g., "The \"name\" field must be filled in"
        error.type = "validation";
      } else {
        error.message =
          errorMappings[response.status] ||
          backendMessage ||
          errorMappings.default;
        error.type = response.status ? "api" : "generic";
      }
      console.error(
        `API Error - URL: ${url}, Status: ${error.status || "N/A"}, Type: ${
          error.type
        }, Message: ${error.message}, Response: ${JSON.stringify(errorData)}`
      );
      throw error;
    }

    const result = await response.json();
    console.log(`Fetch success for ${url}:`, result);
    return result;
  } catch (err) {
    console.error(`Fetch error for ${url}:`, err, `Stack: ${err.stack}`);
    if (err.name === "TypeError" && err.message.includes("Failed to fetch")) {
      const error = new Error(
        errorMappings.network ||
          "Unable to connect to the server. Please check your internet connection or try again later."
      );
      error.type = "network";
      throw error;
    }
    throw err;
  }
}
