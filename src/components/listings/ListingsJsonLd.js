import { siteConfig } from "@/lib/site";
import { properties } from "@/data/properties";
import JsonLd from "@/components/JsonLd";

export default function ListingsJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "LiveEasy Homes Property Listings",
        description: `Verified rental homes and apartments listed by ${siteConfig.name}.`,
        numberOfItems: properties.length,
        itemListElement: properties.map((property, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: `${siteConfig.url}/listings/${property.id}`,
          item: {
            "@type": "Apartment",
            name: property.title,
            description: `${property.beds} bed, ${property.baths} bath rental in ${property.location}.`,
            address: {
              "@type": "PostalAddress",
              addressLocality: property.city,
              addressCountry: "IN",
            },
            geo: {
              "@type": "GeoCoordinates",
              latitude: property.lat,
              longitude: property.lng,
            },
            numberOfRooms: property.beds,
            floorSize: {
              "@type": "QuantitativeValue",
              value: property.area,
              unitCode: "FTK",
            },
            offers: {
              "@type": "Offer",
              price: property.price.replace(/,/g, ""),
              priceCurrency: "INR",
              availability: "https://schema.org/InStock",
            },
            image: property.images?.[0] ?? property.image,
          },
        })),
      }}
    />
  );
}
