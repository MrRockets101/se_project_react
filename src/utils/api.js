const baseUrlJson = "http://localhost:3001";

function getItems() {
  return fetch(`${baseUrlJson}/items`).then((res) => {
    if (!res.ok) {
      return Promise.reject(`Error fetching items: ${res.status}`);
    }
    return res.json();
  });
}

function addItem(newItem) {
  return fetch(`${baseUrlJson}/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newItem),
  }).then((res) =>
    res.ok ? res.json() : Promise.reject(`Error adding item: ${res.status}`)
  );
}

export { getItems, addItem };
