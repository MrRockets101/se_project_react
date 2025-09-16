import { IpAPIKey } from "./constants";

export async function getClientIpGeolocation() {
  try {
    const res = await fetch("https://ipapi.co/json/");
    if (!res.ok) throw new Error("Client IP location fetch failed");
    const data = await res.json();
    return {
      latitude: data.latitude,
      longitude: data.longitude,
      source: "client",
    };
  } catch (error) {
    throw new Error("Client-side IP geolocation failed");
  }
}

export async function getServerIpGeolocation() {
  try {
    const res = await fetch(`https://ipinfo.io/json?${IpAPIKey}`);
    if (!res.ok) throw new Error("Server IP location fetch failed");
    const data = await res.json();
    const [latitude, longitude] = data.loc.split(",");
    return {
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      source: "server",
    };
  } catch (error) {
    throw new Error("Server-side IP geolocation failed");
  }
}
