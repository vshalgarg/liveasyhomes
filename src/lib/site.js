export const siteConfig = {
  name: "LiveEasy Homes",
  tagline: "Find your calm place to live",
  description:
    "Find verified, professionally managed rental homes in Delhi, Faridabad, and Delhi-NCR. Browse furnished apartments, book free visits, and move in with confidence on LiveEasy Homes.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://liveasyhomes.com",
  locale: "en_IN",
  ogImage: "/logo-bg.png",
  twitterHandle: "@liveasyhomes",
  keywords: [
    "LiveEasy Homes",
    "rental homes Delhi",
    "rental homes Faridabad",
    "apartments for rent Delhi NCR",
    "verified rental homes",
    "furnished apartments Delhi",
    "managed rentals Faridabad",
    "book property visit",
    "professionally managed apartments",
    "2 BHK for rent Delhi",
    "3 BHK for rent Faridabad",
    "rent house Delhi NCR",
    "hassle free rental homes India",
  ],
  contactEmail: "hello@liveasyhomes.com",
  areasServed: ["Delhi", "Faridabad", "Gurugram", "Noida", "Ghaziabad"],
};

export const defaultOpenGraph = {
  type: "website",
  locale: siteConfig.locale,
  siteName: siteConfig.name,
  images: [
    {
      url: siteConfig.ogImage,
      width: 1200,
      height: 630,
      alt: `${siteConfig.name} — verified rental homes in Delhi NCR`,
    },
  ],
};

/** Shared page metadata helpers */
export function pageKeywords(...extra) {
  return [...new Set([...extra.filter(Boolean), ...siteConfig.keywords])];
}
