import Footer from "@/components/Footer";
import { siteConfig } from "@/lib/site";

export const metadata = {
  title: "Terms & Conditions",
  description: `Terms and conditions for using ${siteConfig.name} website and rental services.`,
  alternates: { canonical: "/terms" },
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <>
      <main
        id="main-content"
        className="container mx-auto px-4 py-16 lg:px-8 lg:py-24 max-w-3xl"
      >
        <h1 className="text-3xl font-serif md:text-4xl text-[#2B2118]">
          Terms &amp; Conditions
        </h1>
        <p className="mt-4 text-gray-600 leading-relaxed">
          By using {siteConfig.name}, you agree to the following terms governing
          access to our website and property listings.
        </p>
        <section className="mt-10 space-y-6 text-gray-600 leading-relaxed">
          <div>
            <h2 className="text-xl font-semibold text-[#2B2118]">Use of listings</h2>
            <p className="mt-2">
              Property details, prices, and availability are provided for
              informational purposes and may change without notice. Visit bookings
              are subject to confirmation by our team.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[#2B2118]">OTP verification</h2>
            <p className="mt-2">
              When booking a free visit, you agree to receive a one-time password
              (OTP) on your registered phone number for identity verification.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[#2B2118]">Contact</h2>
            <p className="mt-2">
              Questions about these terms? Visit our{" "}
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
