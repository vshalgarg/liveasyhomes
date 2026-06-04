import Footer from "@/components/Footer";
import ContactHero from "@/components/contact/ContactHero";
import ContactInfo from "@/components/contact/ContactInfo";
import ContactForm from "@/components/contact/ContactForm";
import ContactCTA from "@/components/contact/ContactCTA";
import AnimateIn from "@/components/AnimateIn";
import { siteConfig } from "@/lib/site";

export const metadata = {
  title: "Contact Us",
  description: `Get in touch with ${siteConfig.name} for rental enquiries, home viewings, and support. Reach us by phone, email, or send us a message — we reply within 24 hours.`,
  alternates: { canonical: "/contact" },
  openGraph: {
    title: `Contact ${siteConfig.name}`,
    description: `Reach out to ${siteConfig.name} — we're here to help with rental enquiries, viewings, and support.`,
    url: "/contact",
  },
};

export default function Contact() {
  return (
    <>
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
