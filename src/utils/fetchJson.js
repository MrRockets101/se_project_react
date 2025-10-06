import { errorMappings } from "./errorMappings";

export async function fetchJson(
  url,
  options = { method: "GET" },
  errorMessage = "Request failed"
) {
  try {
    const token = localStorage.getItem("jwt");

    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    console.log("Fetch request with token:", token);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const backendMessage = errorData.message || errorMessage;
      const error = new Error(backendMessage);
      error.status = response.status;
      // Use errorMappings for consistent messages
      error.message =
        errorMappings[response.status] ||
        backendMessage ||
        errorMappings.default;
      throw error;
    }

    return await response.json();
  } catch (err) {
    if (err.status) {
      console.error(
        `API Error - Status: ${err.status}, Message: ${err.message}`
      );
      throw new Error(err.message);
    }
    throw new Error(err.message || errorMessage);
  }
}
