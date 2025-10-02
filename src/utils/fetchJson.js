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

    if (!response.ok) {
      throw new Error(`${errorMessage}: ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    throw new Error(err.message || errorMessage);
  }
}
