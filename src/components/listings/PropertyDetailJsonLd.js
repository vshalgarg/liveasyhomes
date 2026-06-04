import JsonLd from "@/components/JsonLd";
import { siteConfig } from "@/lib/site";

export default function PropertyDetailJsonLd({ property }) {
  const images = property.images?.length
    ? property.images
    : property.image
      ? [property.image]
      : [];

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Apartment",
        name: property.title,
        description: property.description,
        url: `${siteConfig.url}/listings/${property.id}`,
        image: images,
        address: {
          "@type": "PostalAddress",
          addressLocality: property.city,
          streetAddress: property.location,
          addressCountry: "IN",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: property.lat,
          longitude: property.lng,
        },
        numberOfRooms: property.beds,
        numberOfBathroomsTotal: property.baths,
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
          url: `${siteConfig.url}/listings/${property.id}`,
        },
      }}
    />
  );
}
