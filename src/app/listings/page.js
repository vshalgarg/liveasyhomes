import Footer from "@/components/Footer";
import PropertyListing from "@/components/PropertyListing";
import ListingsJsonLd from "@/components/listings/ListingsJsonLd";
import { siteConfig } from "@/lib/site";

export const metadata = {
  title: "Property Listings",
  description: `Browse verified rental homes in Bangalore with ${siteConfig.name}. Filter by location and budget, view homes on the map, and book a free visit with OTP verification.`,
  keywords: [
    "rental listings Bangalore",
    "verified rental homes",
    "apartments for rent Bangalore",
    "book property visit",
    "LiveEasy Homes properties",
  ],
  alternates: { canonical: "/listings" },
  openGraph: {
    title: `Property Listings | ${siteConfig.name}`,
    description: `Discover verified, professionally managed rental homes across Bangalore.`,
    url: "/listings",
  },
};

export default function ListingsPage() {
  return (
    <>
      <ListingsJsonLd />
      <main id="main-content" className="bg-[#F8F5F1]">
        <PropertyListing />
      </main>
      <Footer />
    </>
  );
}
