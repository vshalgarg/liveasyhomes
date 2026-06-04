import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import ListingDetailPage from "@/components/listings/ListingDetailPage";
import PropertyDetailJsonLd from "@/components/listings/PropertyDetailJsonLd";
import {
  getAllPropertyIds,
  getPropertyById,
  getSimilarProperties,
} from "@/data/properties";
import { siteConfig } from "@/lib/site";

export async function generateStaticParams() {
  return getAllPropertyIds().map((id) => ({ id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const property = getPropertyById(id);

  if (!property) {
    return { title: "Property Not Found" };
  }

  const title = `${property.title} — ${property.location}`;
  const description = `${property.beds} bed, ${property.baths} bath ${property.propertyType?.toLowerCase() ?? "home"} for rent in ${property.location}. ₹${property.price}/month. ${property.description?.slice(0, 120)}…`;

  const images = property.images?.length ? property.images : [];

  return {
    title,
    description,
    keywords: [
      `${property.title} rent`,
      `apartment ${property.city}`,
      property.location,
      "verified rental Bangalore",
      siteConfig.name,
    ],
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
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: images[0] ? [images[0]] : undefined,
    },
  };
}

export default async function PropertyDetailRoute({ params }) {
  const { id } = await params;
  const property = getPropertyById(id);

  if (!property) {
    notFound();
  }

  const similarProperties = getSimilarProperties(id, 3);

  return (
    <>
      <PropertyDetailJsonLd property={property} />
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
