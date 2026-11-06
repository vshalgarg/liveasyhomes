import Footer from "@/components/Footer";
import AdminAddPropertyGate from "@/components/admin/AdminAddPropertyGate";

export const metadata = {
  title: "Admin · Add Property",
  description: "Private admin tool to publish rental listings on LiveEasy Homes.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function AdminAddPropertyPage() {
  return (
    <>
      <main id="main-content" className="bg-[#F8F5F1]">
        <section className="pt-10 pb-6 md:pt-14 md:pb-8">
          <div className="container mx-auto px-4 lg:px-8">
            <p className="text-xs sm:text-sm uppercase tracking-[0.2em] text-[#B08B6D] font-medium">
              Secure admin
            </p>
            <h1 className="mt-3 text-3xl sm:text-4xl font-serif text-[#2B2118] leading-snug max-w-2xl">
              Add a property
            </h1>
            <p className="mt-3 text-gray-600 max-w-xl leading-relaxed">
              Private listing tools for LiveEasy admins. Visitors use the public
              Properties page and Visit for Free to request a viewing.
            </p>
          </div>
        </section>

        <section className="pb-16 md:pb-24" aria-label="Admin add property">
          <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
            <AdminAddPropertyGate />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
