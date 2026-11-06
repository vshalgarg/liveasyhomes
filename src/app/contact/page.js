import Footer from "@/components/Footer";
import ContactHero from "@/components/contact/ContactHero";
import ContactInfo from "@/components/contact/ContactInfo";
import ContactForm from "@/components/contact/ContactForm";
import ContactCTA from "@/components/contact/ContactCTA";
import AnimateIn from "@/components/AnimateIn";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { siteConfig, pageKeywords, defaultOpenGraph } from "@/lib/site";

const title = "Contact Us";
const description = `Contact ${siteConfig.name} for rental enquiries, home viewings, and support in Delhi & Faridabad. Call, email, or send a message — we reply within 24 hours.`;

export const metadata = {
  title,
  description,
  keywords: pageKeywords(
    "contact LiveEasy Homes",
    "rental enquiry Delhi",
    "book home visit Faridabad",
    "LiveEasy Homes phone email"
  ),
  alternates: { canonical: "/contact" },
  openGraph: {
    ...defaultOpenGraph,
    title: `Contact ${siteConfig.name}`,
    description,
    url: "/contact",
  },
  twitter: {
    card: "summary_large_image",
    title: `Contact ${siteConfig.name}`,
    description,
    images: [siteConfig.ogImage],
  },
};

export default function Contact() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/home" },
          { name: "Contact", href: "/contact" },
        ]}
      />
      <main id="main-content">
        <ContactHero />

        <section
          className="bg-[#F8F5F1] pb-16 md:pb-24"
          aria-label="Contact information and message form"
        >
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10 items-stretch">
              <div className="lg:col-span-2">
                <ContactInfo />
              </div>
              <div className="lg:col-span-3">
                <AnimateIn animation="fade-left" delay={120} duration={750}>
                  <ContactForm />
                </AnimateIn>
              </div>
            </div>
          </div>
        </section>

        <ContactCTA />
      </main>
      <Footer />
    </>
  );
}
