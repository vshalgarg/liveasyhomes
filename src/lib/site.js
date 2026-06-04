export const siteConfig = {
  name: "LiveEasy Homes",
  description:
    "Find verified rental homes in Bangalore and across India. Professionally managed properties, trusted tenants, and a hassle-free move-in experience.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://liveasyhomes.com",
  locale: "en_IN",
  ogImage: "/logo-bg.png",
  keywords: [
    "rental homes Bangalore",
    "managed apartments",
    "verified rental homes",
    "LiveEasy Homes",
    "furnished rentals India",
    "rent apartment Bangalore",
  ],
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
      alt: `${siteConfig.name} — verified rental homes`,
    },
  ],
};
