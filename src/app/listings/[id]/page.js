import Footer from "@/components/Footer";
import ListingDetailPage from "@/components/listings/ListingDetailPage";
import ListingDetailResolver from "@/components/listings/ListingDetailResolver";
import PropertyDetailJsonLd from "@/components/listings/PropertyDetailJsonLd";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import {
  getAllPropertyIds,
  getPropertyById,
  getSimilarProperties,
} from "@/data/properties";
import { getProperty } from "@/lib/api/properties";
import { pageKeywords, siteConfig } from "@/lib/site";
import { richTextToPlain } from "@/lib/richText";

export async function generateStaticParams() {
  return getAllPropertyIds().map((id) => ({ id }));
}

async function resolveProperty(id) {
  const staticProperty = getPropertyById(id);
  if (staticProperty) return { property: staticProperty, fromApi: false };

  try {
    const property = await getProperty(id);
    return { property, fromApi: true };
  } catch {
    return { property: null, fromApi: true };
  }
}

function buildMeta(property) {
  const plainDescription = richTextToPlain(property.description);
  const title = `${property.title} — ${property.location}`;
  const description = `${property.beds} bed, ${property.baths} bath ${
    property.propertyType?.toLowerCase() ?? "home"
  } for rent in ${property.location}. ₹${property.price}/month.${
    plainDescription ? ` ${plainDescription.slice(0, 140)}` : ""
  }`;
  const images = property.images?.length
    ? property.images
    : property.image
      ? [property.image]
      : [];

  return {
    title,
    description,
    keywords: pageKeywords(
      `${property.title} for rent`,
      `${property.floorPlan || `${property.beds} BHK`} rent ${property.city}`,
      `apartment ${property.city}`,
      property.location,
      `rent in ${property.city}`,
      "verified rental Delhi NCR"
    ),
    alternates: {
      canonical: `/listings/${property.id}`,
    },
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description,
      url: `/listings/${property.id}`,
      type: "website",
      images: images[0]
        ? [{ url: images[0], width: 1200, height: 630, alt: title }]
        : [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: images[0] ? [images[0]] : [siteConfig.ogImage],
    },
  };
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const { property } = await resolveProperty(id);

  if (!property) {
    return {
      title: "Property not found",
      description: `This listing could not be found on ${siteConfig.name}. Browse verified rentals in Delhi and Faridabad.`,
      robots: { index: false, follow: true },
    };
  }

  return buildMeta(property);
}

export default async function PropertyDetailRoute({ params }) {
  const { id } = await params;
  const { property, fromApi } = await resolveProperty(id);

  if (property && !fromApi) {
    const similarProperties = getSimilarProperties(id, 3);

    return (
      <>
        <PropertyDetailJsonLd property={property} />
        <BreadcrumbJsonLd
          items={[
            { name: "Home", href: "/home" },
            { name: "Properties", href: "/listings" },
            { name: property.title, href: `/listings/${property.id}` },
          ]}
        />
        <main id="main-content">
          <ListingDetailPage
            property={property}
            similarProperties={similarProperties}
          />
        </main>
        <Footer />
      </>
    );
  }

  // API listings: client resolver + optional SSR property for JSON-LD when fetch succeeded
  return (
    <>
      {property && <PropertyDetailJsonLd property={property} />}
      {property && (
        <BreadcrumbJsonLd
          items={[
            { name: "Home", href: "/home" },
            { name: "Properties", href: "/listings" },
            { name: property.title, href: `/listings/${property.id}` },
          ]}
        />
      )}
      <main id="main-content">
        <ListingDetailResolver
          id={id}
          initialProperty={property}
        />
      </main>
      <Footer />
    </>
  );
}
