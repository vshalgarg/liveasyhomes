import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import AnimateIn from "../AnimateIn";

export default function AboutCTA() {
  return (
    <section
      className="bg-[#FAF8F5] py-16 md:py-20"
      aria-labelledby="about-cta-heading"
    >
      <div className="container mx-auto px-4 lg:px-8">
        <AnimateIn animation="fade-up">
          <div className="relative overflow-hidden rounded-3xl border border-[#EFE7DF] bg-[#F7F3EE] px-6 py-10 sm:px-10 sm:py-14 md:px-14 md:py-16">
            <div
              className="pointer-events-none absolute -top-24 -right-16 h-64 w-64 rounded-full bg-[#EFE7DF] blur-3xl"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-[#E8DFD6] blur-3xl"
              aria-hidden="true"
            />

            <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-8">
              <div className="max-w-xl">
                <span className="uppercase text-xs tracking-[0.25em] text-[#B08B6D] font-semibold">
                  Ready when you are
                </span>
                <h2
                  id="about-cta-heading"
                  className="mt-3 text-3xl md:text-4xl font-serif text-[#2B2118] leading-snug"
                >
                  Find a home that feels like your{" "}
                  <span className="italic text-[#B08B6D]">calm</span> place.
                </h2>
                <p className="mt-4 text-gray-600 leading-relaxed">
                  Browse our verified homes or talk to our team — we&apos;ll
                  help you find the one that fits your life.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <Link
                  href="/listings"
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 bg-[#2B1D13] hover:bg-[#3a2a1e] text-white px-6 py-3 rounded-full transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] font-medium"
                >
                  Explore Homes
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 border border-[#D7CEC7] bg-white text-[#2B2118] px-6 py-3 rounded-full transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] font-medium hover:bg-[#FAF8F5]"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  Talk to Us
                </Link>
              </div>
            </div>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
