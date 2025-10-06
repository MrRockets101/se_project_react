import { fetchJson } from "./fetchJson";
import { BASE_URL } from "./constants";

export function register({ name, avatar, email, password }) {
  return fetchJson(
    `${BASE_URL}/signup`,
    {
      method: "POST",
      body: JSON.stringify({ name, avatar, email, password }),
    },
    "Registration failed"
  ).catch((error) => {
    throw error;
  });
}

export function login({ email, password }) {
  return fetchJson(
    `${BASE_URL}/signin`,
    {
      method: "POST",
      body: JSON.stringify({ email, password }),
    },
    "Login failed"
  )
    .then((data) => {
      if (data.token) {
        localStorage.setItem("jwt", data.token);
      }
      return data;
    })
    .catch((error) => {
      throw error;
    });
}

export function getCurrentUser() {
  return fetchJson(
    `${BASE_URL}/users`,
    {},
    "Failed to fetch user profile"
  ).catch((error) => {
    throw error;
  });
}

export function updateCurrentUser({ name, avatar }) {
  return fetchJson(
    `${BASE_URL}/users`,
    {
      method: "PATCH",
      body: JSON.stringify({ name, avatar }),
    },
    "Failed to update profile"
  ).catch((error) => {
    throw error;
  });
}

export async function getItems() {
  try {
    const result = await fetchJson(
      `${BASE_URL}/items`,
      {},
      "Error fetching items"
    );

    return Array.isArray(result) ? result : [];
  } catch (error) {
    throw error;
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
  ).catch((error) => {
    throw error;
  });
}

export function updateItem(id, imageUrl) {
  return fetchJson(
    `${BASE_URL}/items/${id}`,
    {
      method: "PUT",
      body: JSON.stringify({ imageUrl }),
    },
    "Error updating item"
  ).catch((error) => {
    throw error;
  });
}

export function deleteItem(id) {
  return fetchJson(
    `${BASE_URL}/items/${id}`,
    {
      method: "DELETE",
    },
    "Error deleting item"
  ).catch((error) => {
    throw error;
  });
}

export function likeItem(id) {
  return fetchJson(
    `${BASE_URL}/items/${id}/likes`,
    {
      method: "PUT",
    },
    "Error liking item"
  ).catch((error) => {
    throw error;
  });
}

export function unlikeItem(id) {
  return fetchJson(
    `${BASE_URL}/items/${id}/likes`,
    {
      method: "DELETE",
    },
    "Error unliking item"
  ).catch((error) => {
    throw error;
  });
}
