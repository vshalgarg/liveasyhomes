import Footer from "@/components/Footer";
import { siteConfig } from "@/lib/site";

export const metadata = {
  title: "Privacy Policy",
  description: `Privacy policy for ${siteConfig.name} — how we collect, use, and protect your personal information when you search rentals or book visits.`,
  keywords: [
    "LiveEasy Homes privacy policy",
    "rental platform data protection",
    "personal information India",
  ],
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <>
      <main
        id="main-content"
        className="container mx-auto px-4 py-16 lg:px-8 lg:py-24 max-w-3xl"
      >
        <h1 className="text-3xl font-serif md:text-4xl text-[#2B2118]">
          Privacy Policy
        </h1>
        <p className="mt-4 text-gray-600 leading-relaxed">
          {siteConfig.name} respects your privacy. This page outlines how we
          handle information when you browse our site, book property visits, or
          contact our team.
        </p>
        <section className="mt-10 space-y-6 text-gray-600 leading-relaxed">
          <div>
            <h2 className="text-xl font-semibold text-[#2B2118]">
              Information we collect
            </h2>
            <p className="mt-2">
              When you request a visit or contact us, we may collect your name,
              email address, and phone number to schedule viewings and verify
              your identity via OTP.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[#2B2118]">How we use it</h2>
            <p className="mt-2">
              We use this information only to respond to enquiries, arrange
              property visits, and improve our services. We do not sell your
              personal data to third parties.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[#2B2118]">Contact</h2>
            <p className="mt-2">
              For privacy-related questions, please reach us through our{" "}
              <a href="/contact" className="text-[#8A6A55] underline">
                contact page
              </a>
              .
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
