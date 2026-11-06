import JsonLd from "@/components/JsonLd";
import { siteConfig } from "@/lib/site";
import { richTextToPlain } from "@/lib/richText";

export default function PropertyDetailJsonLd({ property }) {
  const images = property.images?.length
    ? property.images
    : property.image
      ? [property.image]
      : [];

  const description = richTextToPlain(property.description) || property.description;
  const priceAmount = String(property.priceAmount ?? property.price ?? "").replace(
    /[^\d]/g,
    ""
  );

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Apartment",
        name: property.title,
        description,
        url: `${siteConfig.url}/listings/${property.id}`,
        image: images,
        address: {
          "@type": "PostalAddress",
          addressLocality: property.city || "Delhi",
          streetAddress: property.location,
          addressRegion: "Delhi NCR",
          addressCountry: "IN",
        },
        geo:
          property.lat != null && property.lng != null
            ? {
                "@type": "GeoCoordinates",
                latitude: property.lat,
                longitude: property.lng,
              }
            : undefined,
        numberOfRooms: property.beds,
        numberOfBathroomsTotal: property.baths,
        floorSize: property.area
          ? {
              "@type": "QuantitativeValue",
              value: property.area,
              unitCode: "FTK",
            }
          : undefined,
        amenityFeature: (property.amenities || []).map((a) => ({
          "@type": "LocationFeatureSpecification",
          name: typeof a === "string" ? a : a.label || a.key,
          value: true,
        })),
        offers: {
          "@type": "Offer",
          price: priceAmount,
          priceCurrency: "INR",
          availability: "https://schema.org/InStock",
          url: `${siteConfig.url}/listings/${property.id}`,
          seller: {
            "@type": "RealEstateAgent",
            name: siteConfig.name,
            url: siteConfig.url,
          },
        },
      }}
    />
  );
}
