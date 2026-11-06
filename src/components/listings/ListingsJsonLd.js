import { siteConfig } from "@/lib/site";
import JsonLd from "@/components/JsonLd";

/** CollectionPage schema for /listings (properties load from API client-side). */
export default function ListingsJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Property Listings | LiveEasy Homes",
        description: `Verified rental homes and apartments in Delhi and Faridabad listed by ${siteConfig.name}.`,
        url: `${siteConfig.url}/listings`,
        isPartOf: {
          "@type": "WebSite",
          name: siteConfig.name,
          url: siteConfig.url,
        },
        about: {
          "@type": "Thing",
          name: "Rental homes in Delhi NCR",
        },
        mainEntity: {
          "@type": "ItemList",
          name: "LiveEasy Homes Property Listings",
          itemListOrder: "https://schema.org/ItemListUnordered",
          description: `Browse professionally managed rental homes across Delhi and Faridabad.`,
        },
      }}
    />
  );
}
