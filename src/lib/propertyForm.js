export const MAX_PROPERTY_PHOTOS = 8;

/** Client-side resize + JPEG compress before multipart upload. */
export async function compressImageFile(
  file,
  { maxWidth = 1600, maxHeight = 1600, quality = 0.72 } = {}
) {
  if (typeof window === "undefined" || !file?.type?.startsWith("image/")) {
    return file;
  }

  let bitmap;
  try {
    if (typeof createImageBitmap === "function") {
      bitmap = await createImageBitmap(file);
    }
  } catch {
    bitmap = null;
  }

  const drawToCanvas = (source, width, height) => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(source, 0, 0, width, height);
    return canvas;
  };

  let canvas = null;

  if (bitmap) {
    const scale = Math.min(1, maxWidth / bitmap.width, maxHeight / bitmap.height);
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));
    canvas = drawToCanvas(bitmap, width, height);
    bitmap.close?.();
  } else {
    canvas = await new Promise((resolve, reject) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width, maxHeight / img.height);
        const width = Math.max(1, Math.round(img.width * scale));
        const height = Math.max(1, Math.round(img.height * scale));
        const drawn = drawToCanvas(img, width, height);
        URL.revokeObjectURL(objectUrl);
        resolve(drawn);
      };
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error("Could not read image."));
      };
      img.src = objectUrl;
    });
  }

  if (!canvas) return file;

  const blob = await new Promise((resolve) => {
    canvas.toBlob((result) => resolve(result), "image/jpeg", quality);
  });

  if (!blob) return file;

  // Keep original if compression somehow grew the file
  if (blob.size >= file.size && file.type === "image/jpeg") {
    return file;
  }

  const baseName = String(file.name || "photo")
    .replace(/\.[^.]+$/, "")
    .replace(/[^\w.-]+/g, "-")
    .slice(0, 80);
  return new File([blob], `${baseName || "photo"}.jpg`, {
    type: "image/jpeg",
    lastModified: Date.now(),
  });
}

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

const LOCATION_COORDS = {
  // Delhi
  saket: { lat: 28.5245, lng: 77.2066 },
  "greater kailash": { lat: 28.5483, lng: 77.2397 },
  dwarka: { lat: 28.5921, lng: 77.046 },
  "south delhi": { lat: 28.5245, lng: 77.2066 },
  delhi: { lat: 28.6139, lng: 77.209 },
  // Faridabad
  "sector 15": { lat: 28.395, lng: 77.312 },
  "sector 21": { lat: 28.421, lng: 77.308 },
  "sector 37": { lat: 28.345, lng: 77.322 },
  faridabad: { lat: 28.4089, lng: 77.3178 },
  // Bangalore
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
  bangalore: { lat: 12.9716, lng: 77.5946 },
  bengaluru: { lat: 12.9716, lng: 77.5946 },
};

const DEFAULT_COORDS = { lat: 12.9716, lng: 77.5946 };

const CITY_ALIASES = [
  { match: /\bfaridabad\b/i, city: "Faridabad" },
  { match: /\bdelhi\b|\bnew delhi\b/i, city: "Delhi" },
  { match: /\bnoida\b/i, city: "Noida" },
  { match: /\bgurugram\b|\bgurgaon\b/i, city: "Gurugram" },
  { match: /\bgaziabad\b|\bghaziabad\b/i, city: "Gaziabad" },
  { match: /\bbangalore\b|\bbengaluru\b/i, city: "Bangalore" },
];

export function resolveCoords(location) {
  const key = String(location || "").toLowerCase();
  // Prefer more specific locality keys before broad city names
  const sorted = Object.entries(LOCATION_COORDS).sort(
    (a, b) => b[0].length - a[0].length
  );
  for (const [name, coords] of sorted) {
    if (key.includes(name)) return coords;
  }
  return DEFAULT_COORDS;
}

function deriveCity(location) {
  const text = String(location || "").trim();
  if (!text) return "Bangalore";

  const parts = text
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
  if (parts.length > 1) {
    const tail = parts[parts.length - 1];
    for (const alias of CITY_ALIASES) {
      if (alias.match.test(tail)) return alias.city;
    }
    return tail;
  }

  for (const alias of CITY_ALIASES) {
    if (alias.match.test(text)) return alias.city;
  }
  return "Bangalore";
}

function itemList(items) {
  return (Array.isArray(items) ? items : [])
    .map((item) => String(item).trim())
    .filter(Boolean)
    .slice(0, 20)
    .map((item) => item.slice(0, 240));
}

function enteredCoordinate(value) {
  const text = String(value ?? "").trim();
  if (!text) return null;
  const number = Number(text);
  return Number.isFinite(number) ? number : null;
}

/** Build JSON body for POST /api/properties (photos uploaded separately). */
export function buildPropertyPayload(values) {
  const enteredLat = enteredCoordinate(values.lat);
  const enteredLng = enteredCoordinate(values.lng);
  const coords =
    enteredLat != null && enteredLng != null
      ? { lat: enteredLat, lng: enteredLng }
      : resolveCoords(values.location);
  const selectedAmenityKeys = (values.amenities || []).filter((key) =>
    AMENITY_OPTIONS.some((option) => option.key === key)
  );
  const highlights = String(values.highlights || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 12)
    .map((line) => line.slice(0, 240));

  const priceDigits = String(values.price).replace(/[^\d]/g, "");

  return {
    title: values.title.trim(),
    location: values.location.trim(),
    city: values.city?.trim() || deriveCity(values.location),
    lat: coords.lat,
    lng: coords.lng,
    price: priceDigits,
    beds: Number(values.beds) || 1,
    baths: Number(values.baths) || 1,
    area: Number(values.area) || 0,
    tag: "New",
    section: "new",
    propertyType: values.propertyType || "Gated Apartment",
    floorPlan: values.floorPlan || "1 BHK",
    furnished: values.furnished || "Fully furnished",
    availableFrom: values.availableFrom || "",
    onboardingCharge:
      Number(String(values.onboardingCharge).replace(/[^\d]/g, "")) || 0,
    deposit: values.deposit || "2 months rent",
    maintenance: values.maintenance || "Included in rent",
    rentExcludes: itemList(values.rentExcludes),
    liveasyManages: itemList(values.liveasyManages),
    ownerResponsibilities: itemList(values.ownerResponsibilities),
    termsAndConditions: String(values.termsAndConditions || "").trim(),
    // May include sanitized HTML from the rich-text editor (bold/italic/etc.)
    description: String(values.description || "").trim(),
    highlights:
      highlights.length > 0
        ? highlights
        : [
            "Listed on LiveEasy Homes",
            "Professionally managed experience",
            "Book a free visit anytime",
          ],
    amenities:
      selectedAmenityKeys.length > 0
        ? selectedAmenityKeys
        : AMENITY_OPTIONS.slice(0, 6).map((option) => option.key),
    status: "PUBLISHED",
    isActive: values.isActive !== false,
  };
}
