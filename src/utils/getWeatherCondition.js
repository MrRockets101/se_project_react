import { weatherConditionArray } from "./weatherConditionArray";

export function getWeatherCondition(weatherCode) {
  for (let entry of weatherConditionArray) {
    if (entry.codes.includes(weatherCode)) {
      return entry.category;
    }
  }
  return "unknown";
}
