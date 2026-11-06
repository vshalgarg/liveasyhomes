export const SEARCH_LOCATIONS = [
  "Delhi",
  "Faridabad",
  "Gurugram",
  "Noida",
  "Gaziabad",
];

export const COMING_SOON_LOCATIONS = ["Gurugram", "Noida", "Gaziabad"];

export function isComingSoonLocation(location) {
  return COMING_SOON_LOCATIONS.includes(String(location || "").trim());
}
