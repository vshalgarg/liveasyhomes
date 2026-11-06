import HomeBanner from "@/components/HomeBanner";
import PropertySearch from "@/components/PropertySearch";
import FeaturesSection from "@/components/FeaturesSection";
import HomeListing from "@/components/HomeListing";
import WhyChooseUS from "@/components/WhyChooseUs";
import StatsSection from "@/components/StatsSection";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import { OrganizationJsonLd, WebSiteJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";
import { siteConfig, pageKeywords, defaultOpenGraph } from "@/lib/site";

export const metadata = {
  title: {
    absolute: `${siteConfig.name} | Verified Rentals in Delhi & Faridabad`,
  },
  description: siteConfig.description,
  keywords: pageKeywords(
    "rent apartment Delhi",
    "rent apartment Faridabad",
    "find rental home Delhi NCR"
  ),
  alternates: {
    canonical: "/home",
  },
  openGraph: {
    ...defaultOpenGraph,
    title: `${siteConfig.name} | Verified Rentals in Delhi & Faridabad`,
    description: siteConfig.description,
    url: "/home",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | Verified Rentals in Delhi & Faridabad`,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
};

export default function Home() {
  return (
    <>
      <OrganizationJsonLd />
      <WebSiteJsonLd />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/home" },
        ]}
      />
      <main id="main-content">
        <HomeBanner />
        <PropertySearch />
        <FeaturesSection />
        <HomeListing />
        <WhyChooseUS />
        <StatsSection />
        <Testimonials />
      </main>
      <Footer />
    </>
  );
}
