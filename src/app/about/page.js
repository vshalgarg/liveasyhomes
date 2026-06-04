import Footer from "@/components/Footer";
import AboutHero from "@/components/about/AboutHero";
import AboutStory from "@/components/about/AboutStory";
import AboutValues from "@/components/about/AboutValues";
import HowWeWork from "@/components/about/HowWeWork";
import AboutStats from "@/components/about/AboutStats";
import AboutCTA from "@/components/about/AboutCTA";
import { siteConfig } from "@/lib/site";

export const metadata = {
  title: "About Us",
  description: `Learn about ${siteConfig.name} — a curated network of verified, professionally managed rental homes across India. Discover who we are, how we work, and the values that drive us.`,
  alternates: { canonical: "/about" },
  openGraph: {
    title: `About ${siteConfig.name}`,
    description: `Get to know ${siteConfig.name} — our story, our values, and the simple way we help you find and live in a home you love.`,
    url: "/about",
  },
};

export default function About() {
  return (
    <>
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
