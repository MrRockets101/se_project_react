import { fetchJson } from "./fetchJson";

const baseUrlJson = "http://localhost:3001";

function getItems() {
  return fetchJson(`${baseUrlJson}/items`, {}, "Error fetching items");
}

function addItem(newItem) {
  return fetchJson(
    `${baseUrlJson}/items`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newItem),
    },
    "Error adding item"
  );
}

async function deleteItem(id) {
  const response = await fetch(`${baseUrlJson}/items/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete item");
  }

  return true;
}

export { getItems, addItem, deleteItem };
