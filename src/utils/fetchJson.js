export async function fetchJson(
  url,
  options = {},
  errorMessage = "Request failed"
) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`${errorMessage}: ${response.status}`);
    }
    return await response.json();
  } catch (err) {
    throw new Error(err.message || errorMessage);
  }
}
