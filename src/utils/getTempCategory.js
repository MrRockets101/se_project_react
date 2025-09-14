import { userPreferenceArray } from "./userPreferenceArray";

export function getTempCategory(temp, unit, userPreferenceArray) {
  if (typeof temp !== "number") return "unknown";

  const unitConfig = userPreferenceArray.find((config) => config.unit === unit);
  if (!unitConfig) return "unknown";

  const sortedCategories = [...unitConfig.categories].sort(
    (a, b) => a.threshold - b.threshold
  );

  let currentCategory = sortedCategories[0].name;

  for (const { name, threshold } of sortedCategories) {
    if (temp >= threshold) {
      currentCategory = name;
    } else {
      break;
    }
  }

  return currentCategory;
}
