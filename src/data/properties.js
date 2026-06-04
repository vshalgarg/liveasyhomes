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
    location: "Indiranagar, Bangalore",
    city: "Bangalore",
    lat: 12.9784,
    lng: 77.6408,
    price: "48,000",
    beds: 2,
    baths: 2,
    area: 1200,
    tag: "Featured",
    section: "featured",
    propertyType: "Apartment",
    furnished: "Fully furnished",
    availableFrom: "Immediate move-in",
    deposit: "2 months rent",
    maintenance: "Included in rent",
    images: [img.livingA, img.livingB, img.livingC, img.dining],
    description:
      "A sun-filled two-bedroom retreat in the heart of Indiranagar — warm timber accents, soft natural light, and a layout designed for calm everyday living. Professionally managed with hotel-grade finishes and thoughtful details throughout.",
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
    location: "Koramangala, Bangalore",
    city: "Bangalore",
    lat: 12.9352,
    lng: 77.6245,
    price: "62,000",
    beds: 3,
    baths: 3,
    area: 1500,
    tag: "Featured",
    section: "featured",
    propertyType: "Apartment",
    furnished: "Fully furnished",
    availableFrom: "Within 7 days",
    deposit: "2 months rent",
    maintenance: "Included in rent",
    images: [img.modernA, img.modernB, img.modernC, img.livingA],
    description:
      "Spacious three-bedroom residence with contemporary interiors and expansive living zones — ideal for families or professionals who value space, privacy, and a polished urban lifestyle in Koramangala.",
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
    location: "HSR Layout, Bangalore",
    city: "Bangalore",
    lat: 12.9116,
    lng: 77.6474,
    price: "55,000",
    beds: 2,
    baths: 2,
    area: 1300,
    tag: "Verified",
    section: "featured",
    propertyType: "Apartment",
    furnished: "Semi-furnished",
    availableFrom: "Immediate move-in",
    deposit: "1.5 months rent",
    maintenance: "Included in rent",
    images: [img.livingC, img.dining, img.livingA, img.roomA],
    description:
      "Quiet, tree-lined HSR address with earthy tones and minimalist styling. Serene Living balances comfort and function — open dining, generous bedrooms, and a managed experience from day one.",
    highlights: [
      "Verified LiveEasy Homes listing",
      "Green neighbourhood pocket",
      "In-unit washing machine",
      "Flexible lease terms",
    ],
    amenities: sharedAmenities,
  },
  {
    id: "cedar-loft",
    title: "Cedar Loft",
    location: "Whitefield, Bangalore",
    city: "Bangalore",
    lat: 12.9698,
    lng: 77.7499,
    price: "52,000",
    beds: 2,
    baths: 2,
    area: 1180,
    tag: "New",
    section: "new",
    propertyType: "Loft",
    furnished: "Fully furnished",
    availableFrom: "Within 14 days",
    deposit: "2 months rent",
    maintenance: "₹2,500/month",
    images: [img.houseA, img.houseB, img.roomA, img.livingB],
    description:
      "Loft-inspired living in Whitefield with double-height ceilings and warm cedar textures. A fresh addition to our collection — crafted for professionals seeking character without compromising on management quality.",
    highlights: [
      "Double-height living area",
      "Newly renovated interiors",
      "Close to tech parks",
      "EV charging in basement",
    ],
    amenities: sharedAmenities,
  },
  {
    id: "willow-court",
    title: "Willow Court",
    location: "Jayanagar, Bangalore",
    city: "Bangalore",
    lat: 12.925,
    lng: 77.5938,
    price: "45,000",
    beds: 2,
    baths: 1,
    area: 1050,
    tag: "New",
    section: "new",
    propertyType: "Apartment",
    furnished: "Fully furnished",
    availableFrom: "Immediate move-in",
    deposit: "1 month rent",
    maintenance: "Included in rent",
    images: [img.roomA, img.livingB, img.roomB, img.dining],
    description:
      "Charming Jayanagar apartment with cream walls, soft lighting, and an intimate floor plan perfect for couples or solo residents. Willow Court delivers premium calm at an accessible monthly rent.",
    highlights: [
      "South Bangalore classic locality",
      "Metro connectivity nearby",
      "Compact, efficient layout",
      "Managed move-in support",
    ],
    amenities: sharedAmenities.filter((a) => a.key !== "parking").concat([
      { key: "parking", label: "Street parking available" },
    ]),
  },
  {
    id: "amber-house",
    title: "Amber House",
    location: "Bellandur, Bangalore",
    city: "Bangalore",
    lat: 12.926,
    lng: 77.6762,
    price: "58,000",
    beds: 3,
    baths: 2,
    area: 1420,
    tag: "New",
    section: "new",
    propertyType: "Townhouse",
    furnished: "Fully furnished",
    availableFrom: "Within 7 days",
    deposit: "2 months rent",
    maintenance: "Included in rent",
    images: [img.modernA, img.roomC, img.houseB, img.modernB],
    description:
      "Amber House offers three bedrooms of warm, layered interiors near Bellandur — ideal for shared living or small families. Earthy palettes, ample storage, and professional upkeep included.",
    highlights: [
      "Three-bedroom family layout",
      "Dedicated dining space",
      "Near lakeside walking trails",
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
  return properties.filter((p) => p.id !== id).slice(0, limit);
}

export function getAllPropertyIds() {
  return properties.map((p) => p.id);
}
