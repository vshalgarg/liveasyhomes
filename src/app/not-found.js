import Link from "next/link";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Page Not Found",
  description: "The page you are looking for could not be found.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <>
      <main
        id="main-content"
        className="container mx-auto px-4 py-20 lg:px-8 text-center min-h-[50vh] flex flex-col items-center justify-center"
      >
        <p className="text-sm uppercase tracking-widest text-[#B08B6D]">404</p>
        <h1 className="text-3xl md:text-4xl font-serif text-[#2B2118] mt-4">
          Page not found
        </h1>
        <p className="mt-4 text-gray-600 max-w-md leading-relaxed">
          The page you requested doesn&apos;t exist or may have moved.
        </p>
        <Link
          href="/home"
          className="mt-8 inline-flex min-h-[48px] items-center justify-center bg-[#8B7361] hover:bg-[#7a6656] text-white px-8 py-3 rounded-full font-medium transition"
        >
          Back to Home
        </Link>
      </main>
      <Footer />
    </>
  );
}
