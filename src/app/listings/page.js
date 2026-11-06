import { Suspense } from "react";
import Footer from "@/components/Footer";
import PropertyListing from "@/components/PropertyListing";
import ListingsJsonLd from "@/components/listings/ListingsJsonLd";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { siteConfig, pageKeywords, defaultOpenGraph } from "@/lib/site";

const title = "Property Listings — Delhi & Faridabad Rentals";
const description = `Browse verified rental homes in Delhi and Faridabad with ${siteConfig.name}. Filter by location and budget, explore homes on the map, and book a free visit.`;

export const metadata = {
  title,
  description,
  keywords: pageKeywords(
    "rental listings Delhi",
    "rental homes Faridabad",
    "apartments for rent Delhi",
    "flats for rent Faridabad",
    "map view rental homes",
    "book property visit OTP"
  ),
  alternates: { canonical: "/listings" },
  openGraph: {
    ...defaultOpenGraph,
    title: `${title} | ${siteConfig.name}`,
    description,
    url: "/listings",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [siteConfig.ogImage],
  },
};

export default function ListingsPage() {
  return (
    <>
      <ListingsJsonLd />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/home" },
          { name: "Properties", href: "/listings" },
        ]}
      />
      <main id="main-content" className="bg-[#F8F5F1]">
        <Suspense
          fallback={
            <p className="container mx-auto px-4 lg:px-8 py-16 text-sm text-gray-500">
              Loading properties…
            </p>
          }
        >
          <PropertyListing />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
