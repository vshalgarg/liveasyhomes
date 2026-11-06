import { propertyImages as img } from "./propertyImages";

const sharedAmenities = [
  { key: "wifi", label: "High-speed WiFi" },
  { key: "power", label: "Power backup" },
  { key: "security", label: "24/7 security" },
  { key: "housekeeping", label: "Weekly housekeeping" },
  { key: "parking", label: "Reserved parking" },
  { key: "ac", label: "Air conditioning" },
];

export const properties = [
  {
    id: "maple-heights",
    title: "Maple Heights",
    location: "Saket, Delhi",
    city: "Delhi",
    lat: 28.5245,
    lng: 77.2066,
    price: "48,000",
    beds: 2,
    baths: 2,
    area: 1200,
    tag: "Featured",
    section: "featured",
    propertyType: "Gated Apartment",
    floorPlan: "2 BHK",
    furnished: "Fully furnished",
    availableFrom: "Immediate move-in",
    deposit: "2 months rent",
    maintenance: "Included in rent",
    onboardingCharge: 5000,
    images: [img.livingA, img.livingB, img.livingC, img.dining],
    description:
      "A sun-filled two-bedroom retreat in Saket, Delhi — warm timber accents, soft natural light, and a layout designed for calm everyday living. Professionally managed with hotel-grade finishes throughout.",
    highlights: [
      "Corner unit with cross ventilation",
      "Premium modular kitchen",
      "Walk-in wardrobe in master bedroom",
      "Pet-friendly building",
    ],
    amenities: sharedAmenities,
  },
  {
    id: "olive-residences",
    title: "Olive Residences",
    location: "Greater Kailash, Delhi",
    city: "Delhi",
    lat: 28.5483,
    lng: 77.2397,
    price: "62,000",
    beds: 3,
    baths: 3,
    area: 1500,
    tag: "Featured",
    section: "featured",
    propertyType: "Gated Apartment",
    floorPlan: "3 BHK",
    furnished: "Fully furnished",
    availableFrom: "Within 7 days",
    deposit: "2 months rent",
    maintenance: "Included in rent",
    onboardingCharge: 7500,
    images: [img.modernA, img.modernB, img.modernC, img.livingA],
    description:
      "Spacious three-bedroom residence in Greater Kailash, Delhi with contemporary interiors and expansive living zones — ideal for families who want space and a polished South Delhi lifestyle.",
    highlights: [
      "Three ensuite bathrooms",
      "Dedicated work-from-home nook",
      "Private balcony with city views",
      "Gated community with clubhouse",
    ],
    amenities: [
      ...sharedAmenities,
      { key: "gym", label: "Fitness centre access" },
      { key: "pool", label: "Swimming pool" },
    ],
  },
  {
    id: "serene-living",
    title: "Serene Living",
    location: "Dwarka Sector 10, Delhi",
    city: "Delhi",
    lat: 28.5823,
    lng: 77.0495,
    price: "55,000",
    beds: 2,
    baths: 2,
    area: 1300,
    tag: "Verified",
    section: "featured",
    propertyType: "Builder Floor",
    floorPlan: "2 BHK",
    furnished: "Semi-furnished",
    availableFrom: "Immediate move-in",
    deposit: "1.5 months rent",
    maintenance: "Included in rent",
    onboardingCharge: 4000,
    images: [img.livingC, img.dining, img.livingA, img.roomA],
    description:
      "Quiet Dwarka Sector 10 home with earthy tones and minimalist styling. Serene Living balances comfort and function with open dining and a managed experience from day one.",
    highlights: [
      "Verified LiveEasy Homes listing",
      "Metro connectivity nearby",
      "In-unit washing machine",
      "Flexible lease terms",
    ],
    amenities: sharedAmenities,
  },
  {
    id: "cedar-loft",
    title: "Cedar Loft",
    location: "Sector 15, Faridabad",
    city: "Faridabad",
    lat: 28.3958,
    lng: 77.3124,
    price: "52,000",
    beds: 2,
    baths: 2,
    area: 1180,
    tag: "New",
    section: "new",
    propertyType: "Shared Service Apartment",
    floorPlan: "2 BHK",
    furnished: "Fully furnished",
    availableFrom: "Within 14 days",
    deposit: "2 months rent",
    maintenance: "₹2,500/month",
    onboardingCharge: 3500,
    images: [img.houseA, img.houseB, img.roomA, img.livingB],
    description:
      "Loft-inspired living in Sector 15, Faridabad with double-height ceilings and warm cedar textures — crafted for professionals who want character with managed quality.",
    highlights: [
      "Double-height living area",
      "Newly renovated interiors",
      "Close to NH-19 connectivity",
      "EV charging in basement",
    ],
    amenities: sharedAmenities,
  },
  {
    id: "willow-court",
    title: "Willow Court",
    location: "Sector 21C, Faridabad",
    city: "Faridabad",
    lat: 28.4126,
    lng: 77.3049,
    price: "45,000",
    beds: 1,
    baths: 1,
    area: 1050,
    tag: "New",
    section: "new",
    propertyType: "Gated Apartment",
    floorPlan: "1 BHK",
    furnished: "Fully furnished",
    availableFrom: "Immediate move-in",
    deposit: "1 month rent",
    maintenance: "Included in rent",
    onboardingCharge: 2500,
    images: [img.roomA, img.livingB, img.roomB, img.dining],
    description:
      "Charming Sector 21C, Faridabad apartment with cream walls, soft lighting, and an intimate floor plan perfect for couples or solo residents.",
    highlights: [
      "Metro connectivity nearby",
      "Compact, efficient layout",
      "Managed move-in support",
      "Quiet residential pocket",
    ],
    amenities: sharedAmenities.filter((a) => a.key !== "parking").concat([
      { key: "parking", label: "Street parking available" },
    ]),
  },
  {
    id: "amber-house",
    title: "Amber House",
    location: "Sector 37, Faridabad",
    city: "Faridabad",
    lat: 28.3689,
    lng: 77.3261,
    price: "58,000",
    beds: 3,
    baths: 2,
    area: 1420,
    tag: "New",
    section: "new",
    propertyType: "Independent House",
    floorPlan: "3 BHK",
    furnished: "Fully furnished",
    availableFrom: "Within 7 days",
    deposit: "2 months rent",
    maintenance: "Included in rent",
    onboardingCharge: 6000,
    images: [img.modernA, img.roomC, img.houseB, img.modernB],
    description:
      "Amber House in Sector 37, Faridabad offers three bedrooms of warm, layered interiors — ideal for families or shared living with professional upkeep included.",
    highlights: [
      "Three-bedroom family layout",
      "Dedicated dining space",
      "Near parks and daily essentials",
      "In-house maintenance team",
    ],
    amenities: [
      ...sharedAmenities,
      { key: "garden", label: "Shared garden access" },
    ],
  },
];

export function getPropertiesBySection(section) {
  return properties.filter((p) => p.section === section);
}

export function getPropertyById(id) {
  return properties.find((p) => p.id === id) ?? null;
}

export function getSimilarProperties(id, limit = 3) {
  const current = getPropertyById(id);
  if (!current) return [];
  return properties
    .filter((p) => p.id !== id && p.city === current.city)
    .slice(0, limit);
}

export function getAllPropertyIds() {
  return properties.map((p) => p.id);
}

function parsePrice(value) {
  return Number(String(value ?? "").replace(/[^\d]/g, "")) || 0;
}

/**
 * Filter listings by city/location query from homepage or listings filters.
 * Primary match is `city` (Delhi / Faridabad); also matches neighbourhood text.
 * Pass `list` to filter API results instead of the static catalog.
 */
export function filterProperties(filters = {}, list = properties) {
  const location = String(filters.location || "").trim().toLowerCase();
  const propertyType = String(
    filters.propertyType || filters.type || ""
  ).trim();
  const budget = String(filters.budget || "").trim();

  return list.filter((property) => {
    if (property.isActive === false) return false;

    if (location) {
      const city = String(property.city || "").toLowerCase();
      const area = String(property.location || "").toLowerCase();
      const cityMatch = city === location;
      const areaMatch = area.includes(location);
      if (!cityMatch && !areaMatch) return false;
    }

    if (propertyType && property.propertyType !== propertyType) {
      return false;
    }

    if (budget) {
      const amount = parsePrice(property.price);
      if (budget === "0-30000" && amount >= 30000) return false;
      if (budget === "30000-50000" && (amount < 30000 || amount > 50000)) {
        return false;
      }
      if (budget === "50000-80000" && (amount < 50000 || amount > 80000)) {
        return false;
      }
      if (budget === "80000+" && amount < 80000) return false;
    }

    return true;
  });
}
