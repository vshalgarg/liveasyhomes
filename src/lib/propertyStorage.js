import { properties as staticProperties } from "@/data/properties";

export const STORAGE_KEY = "liveasyhomes:user-properties";
export const MAX_PROPERTY_PHOTOS = 8;

export const AMENITY_OPTIONS = [
  { key: "wifi", label: "High-speed WiFi" },
  { key: "power", label: "Power backup" },
  { key: "security", label: "24/7 security" },
  { key: "housekeeping", label: "Weekly housekeeping" },
  { key: "parking", label: "Reserved parking" },
  { key: "ac", label: "Air conditioning" },
  { key: "gym", label: "Fitness centre access" },
  { key: "pool", label: "Swimming pool" },
  { key: "garden", label: "Shared garden access" },
];

/** Compress a gallery file to a JPEG data URL for localStorage */
export async function fileToCompressedDataUrl(
  file,
  { maxWidth = 1200, quality = 0.72 } = {}
) {
  if (typeof createImageBitmap === "function") {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxWidth / bitmap.width);
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close?.();
    return canvas.toDataURL("image/jpeg", quality);
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

/** Approximate map pins for common Bangalore localities */
const LOCATION_COORDS = {
  indiranagar: { lat: 12.9784, lng: 77.6408 },
  koramangala: { lat: 12.9352, lng: 77.6245 },
  "hsr layout": { lat: 12.9116, lng: 77.6474 },
  hsr: { lat: 12.9116, lng: 77.6474 },
  whitefield: { lat: 12.9698, lng: 77.7499 },
  jayanagar: { lat: 12.925, lng: 77.5938 },
  bellandur: { lat: 12.926, lng: 77.6762 },
  "jp nagar": { lat: 12.9063, lng: 77.5857 },
  "btm layout": { lat: 12.9166, lng: 77.6101 },
  hebbal: { lat: 13.0358, lng: 77.597 },
  "electronic city": { lat: 12.8399, lng: 77.677 },
  marathahalli: { lat: 12.9591, lng: 77.6974 },
};

const DEFAULT_COORDS = { lat: 12.9716, lng: 77.5946 };

export function slugify(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function formatPrice(value) {
  const digits = String(value).replace(/[^\d]/g, "");
  if (!digits) return "";
  return Number(digits).toLocaleString("en-IN");
}

function resolveCoords(location) {
  const key = String(location || "").toLowerCase();
  for (const [name, coords] of Object.entries(LOCATION_COORDS)) {
    if (key.includes(name)) return coords;
  }
  return DEFAULT_COORDS;
}

function isBrowser() {
  return typeof window !== "undefined";
}

export function getUserProperties() {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getUserPropertyById(id) {
  return getUserProperties().find((p) => p.id === id) ?? null;
}

export function saveUserProperty(property) {
  if (!isBrowser()) return null;
  const existing = getUserProperties();
  const next = [property, ...existing.filter((p) => p.id !== property.id)];
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch (error) {
    if (error?.name === "QuotaExceededError") {
      throw new Error(
        "Storage is full. Try fewer or smaller photos, or remove older listings."
      );
    }
    throw error;
  }
  return property;
}

export function getAllProperties() {
  return [...staticProperties, ...getUserProperties()];
}

export function getMergedPropertyById(id) {
  return (
    staticProperties.find((p) => p.id === id) ?? getUserPropertyById(id) ?? null
  );
}

export function getMergedPropertiesBySection(section) {
  return getAllProperties().filter((p) => p.section === section);
}

export function getMergedSimilarProperties(id, limit = 3) {
  return getAllProperties()
    .filter((p) => p.id !== id)
    .slice(0, limit);
}

function uniqueId(title) {
  const base = slugify(title) || "property";
  const taken = new Set([
    ...staticProperties.map((p) => p.id),
    ...getUserProperties().map((p) => p.id),
  ]);
  if (!taken.has(base)) return base;
  let n = 2;
  while (taken.has(`${base}-${n}`)) n += 1;
  return `${base}-${n}`;
}

/**
 * Build a full property object from add-property form values.
 */
export function buildPropertyFromForm(values) {
  const coords = resolveCoords(values.location);
  const selectedAmenities = AMENITY_OPTIONS.filter((a) =>
    values.amenities?.includes(a.key)
  );
  const images = Array.isArray(values.images)
    ? values.images.filter(Boolean)
    : [];

  const highlights = String(values.highlights || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return {
    id: uniqueId(values.title),
    title: values.title.trim(),
    location: values.location.trim(),
    city: "Bangalore",
    lat: coords.lat,
    lng: coords.lng,
    price: formatPrice(values.price),
    beds: Number(values.beds) || 1,
    baths: Number(values.baths) || 1,
    area: Number(values.area) || 0,
    tag: "New",
    section: "new",
    propertyType: values.propertyType || "Apartment",
    furnished: values.furnished || "Fully furnished",
    availableFrom: values.availableFrom || "Immediate move-in",
    deposit: values.deposit || "2 months rent",
    maintenance: values.maintenance || "Included in rent",
    images,
    description: values.description.trim(),
    highlights:
      highlights.length > 0
        ? highlights
        : [
            "Listed on LiveEasy Homes",
            "Professionally managed experience",
            "Book a free visit anytime",
          ],
    amenities:
      selectedAmenities.length > 0
        ? selectedAmenities
        : AMENITY_OPTIONS.slice(0, 6),
    isUserAdded: true,
  };
}
