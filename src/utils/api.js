import { BASE_URL } from "./constants";
import { fetchJson } from "./fetchJson";

export function register({ name, avatar, email, password }) {
  return fetchJson(
    `${BASE_URL}/signup`,
    {
      method: "POST",
      body: JSON.stringify({ name, avatar, email, password }),
    },
    "Registration failed"
  );
}

export function login({ email, password }) {
  return fetchJson(
    `${BASE_URL}/signin`,
    {
      method: "POST",
      body: JSON.stringify({ email, password }),
    },
    "Login failed"
  ).then((data) => {
    if (data.token) {
      localStorage.setItem("jwt", data.token);
    }
    return data;
  });
}

export function getCurrentUser() {
  return fetchJson(`${BASE_URL}/me`, {}, "Failed to fetch user profile");
}

export function updateCurrentUser({ name, avatar }) {
  return fetchJson(
    `${BASE_URL}/me`,
    {
      method: "PATCH",
      body: JSON.stringify({ name, avatar }),
    },
    "Failed to update profile"
  );
}

export async function getItems() {
  try {
    const result = await fetchJson(
      `${BASE_URL}/items`,
      {},
      "Error fetching items"
    );

    // unwrap items from result.data
    return result.data || [];
  } catch (err) {
    console.error("getItems error:", err);
    return [];
  }
}

export function addItem(newItem) {
  return fetchJson(
    `${BASE_URL}/items`,
    {
      method: "POST",
      body: JSON.stringify(newItem),
    },
    "Error adding item"
  );
}

export function deleteItem(id) {
  return fetchJson(
    `${BASE_URL}/items/${id}`,
    {
      method: "DELETE",
    },
    "Error deleting item"
  );
}

export function likeItem(id) {
  return fetchJson(
    `${BASE_URL}/items/${id}/likes`,
    {
      method: "PUT",
    },
    "Error liking item"
  );
}

export function unlikeItem(id) {
  return fetchJson(
    `${BASE_URL}/items/${id}/likes`,
    {
      method: "DELETE",
    },
    "Error unliking item"
  );
}
