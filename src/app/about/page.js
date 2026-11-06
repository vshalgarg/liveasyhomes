import Footer from "@/components/Footer";
import AboutHero from "@/components/about/AboutHero";
import AboutStory from "@/components/about/AboutStory";
import AboutValues from "@/components/about/AboutValues";
import HowWeWork from "@/components/about/HowWeWork";
import AboutStats from "@/components/about/AboutStats";
import AboutCTA from "@/components/about/AboutCTA";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { siteConfig, pageKeywords, defaultOpenGraph } from "@/lib/site";

const title = "About Us — Who We Are";
const description = `Learn about ${siteConfig.name} — verified, professionally managed rental homes across Delhi-NCR. Our story, values, and how we help you find a home you love.`;

export const metadata = {
  title,
  description,
  keywords: pageKeywords(
    "about LiveEasy Homes",
    "managed rentals company Delhi",
    "trusted rental platform Faridabad"
  ),
  alternates: { canonical: "/about" },
  openGraph: {
    ...defaultOpenGraph,
    title: `About ${siteConfig.name}`,
    description,
    url: "/about",
  },
  twitter: {
    card: "summary_large_image",
    title: `About ${siteConfig.name}`,
    description,
    images: [siteConfig.ogImage],
  },
};

export default function About() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/home" },
          { name: "About", href: "/about" },
        ]}
      />
      <main id="main-content">
        <AboutHero />
        <AboutStory />
        <AboutValues />
        <HowWeWork />
        <AboutStats />
        <AboutCTA />
      </main>
      <Footer />
    </>
  );
}
