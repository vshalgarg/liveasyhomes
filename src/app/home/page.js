import HomeBanner from "@/components/HomeBanner";
import PropertySearch from "@/components/PropertySearch";
import FeaturesSection from "@/components/FeaturesSection";
import HomeListing from "@/components/HomeListing";
import WhyChooseUS from "@/components/WhyChooseUs";
import StatsSection from "@/components/StatsSection";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/JsonLd";
import { siteConfig } from "@/lib/site";

export const metadata = {
  title: "Find Your Calm Place",
  description: siteConfig.description,
  alternates: {
    canonical: "/home",
  },
  openGraph: {
    title: `${siteConfig.name} | Find Your Calm Place`,
    description: siteConfig.description,
    url: "/home",
  },
};

export default function Home() {
  return (
    <>
      <OrganizationJsonLd />
      <WebSiteJsonLd />
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
