import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import readyToFind from "../../../public/ready_to_find.png";
import AnimateIn from "@/components/AnimateIn";

export default function ListingCTA() {
  return (
    <section
      className="py-14 md:py-20 bg-[#F3F1EE]"
      aria-label="Get help finding a home"
    >
      <div className="container mx-auto px-4 lg:px-8">
        <AnimateIn animation="fade-up">
          <aside className="rounded-[28px] bg-[#F5F1EE] border border-[#E8E0D8] overflow-hidden shadow-[0_12px_40px_rgba(43,33,24,0.06)]">
            <div className="flex flex-col md:flex-row md:items-center">
              <div className="relative h-44 sm:h-52 md:h-[200px] md:w-[260px] lg:w-[300px] shrink-0">
                <Image
                  src={readyToFind}
                  alt="Cozy living room interior"
                  fill
                  sizes="(max-width: 768px) 100vw, 300px"
                  className="object-cover object-left"
                />
              </div>

              <div className="flex flex-col gap-6 p-6 sm:p-8 md:flex-row md:items-center md:gap-10 lg:p-10 flex-1">
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-2xl md:text-3xl font-serif text-[#2B2118] leading-snug">
                    Not sure which home fits you?
                  </h2>
                  <p className="mt-3 text-[#4A4A4A] leading-relaxed text-sm sm:text-base">
                    Our team will help you find a verified home that matches your
                    lifestyle and budget.
                  </p>
                </div>

                <Link
                  href="/contact"
                  className="inline-flex shrink-0 self-center md:self-auto min-h-[48px] items-center justify-center gap-2 bg-[#231F20] hover:bg-[#2B2118] text-white px-7 py-3.5 rounded-full transition-all duration-300 text-sm font-medium whitespace-nowrap hover:scale-[1.02] active:scale-[0.98]"
                >
                  Talk to an Expert
                  <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </aside>
        </AnimateIn>
      </div>
    </section>
  );
}
