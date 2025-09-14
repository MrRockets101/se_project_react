export function getTempCategory(temp, unit) {
  if (typeof temp !== "number") return "unknown";

  if (unit === "F") {
    if (temp >= 75) return "hot";
    if (temp >= 60) return "warm";
    return "cold";
  }

  if (unit === "C") {
    if (temp >= 24) return "hot";
    if (temp >= 16) return "warm";
    return "cold";
  }

  return "unknown";
}
