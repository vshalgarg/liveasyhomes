import Image from "next/image";
import { Search, ClipboardCheck, KeyRound, Headphones } from "lucide-react";
import AnimateIn from "../AnimateIn";

const steps = [
  {
    icon: Search,
    title: "Discover the right home",
    desc: "Browse our curated, verified listings or tell us what you're looking for and we'll shortlist matches for you.",
  },
  {
    icon: ClipboardCheck,
    title: "Visit & verify, easily",
    desc: "Book a visit in a single tap. Every home is pre-inspected, so what you see is what you get.",
  },
  {
    icon: KeyRound,
    title: "Move in, worry-free",
    desc: "Transparent agreements, simple onboarding, and a move-in experience that just works.",
  },
  {
    icon: Headphones,
    title: "Live easy, always",
    desc: "From repairs to renewals, our team handles the details so your home stays effortless every single day.",
  },
];

export default function HowWeWork() {
  return (
    <section
      className="relative py-16 md:py-20 bg-[#FAF8F5]"
      aria-labelledby="how-we-work-heading"
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <AnimateIn animation="fade-up">
              <span className="uppercase text-sm tracking-[0.2em] text-[#B08B6D] font-medium">
                How We Work
              </span>
              <h2
                id="how-we-work-heading"
                className="text-3xl md:text-4xl font-serif text-[#2B2118] mt-4 leading-snug"
              >
                A simpler way to find and live in your{" "}
                <span className="italic text-[#B08B6D]">next home</span>.
              </h2>
              <p className="mt-5 text-gray-600 leading-relaxed">
                We&apos;ve replaced the chaos of traditional renting with a
                clear, calm, four-step journey — from your first search to a
                home you genuinely love.
              </p>
            </AnimateIn>

            <AnimateIn animation="fade-up" delay={180}>
              <div className="relative mt-8 h-[220px] sm:h-[260px] lg:h-[300px] rounded-3xl overflow-hidden shadow-md">
                <Image
                  src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1100&q=80"
                  alt="Tenant receiving keys to a new managed rental home"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
            </AnimateIn>
          </div>

          <ol className="lg:col-span-7 relative list-none p-0 m-0 space-y-6 sm:space-y-7">
            <div
              className="hidden sm:block absolute left-6 top-2 bottom-2 w-px bg-gradient-to-b from-[#E8DFD6] via-[#D7CEC7] to-transparent"
              aria-hidden="true"
            />

            {steps.map(({ icon: Icon, title, desc }, index) => (
              <AnimateIn
                key={title}
                animation="fade-left"
                delay={index * 110}
                className="contents"
              >
                <li className="relative flex gap-5 sm:gap-6 rounded-2xl bg-white border border-[#EFE7DF] p-6 sm:p-7 transition-shadow duration-300 hover:shadow-md">
                  <div className="relative shrink-0">
                    <span
                      className="flex h-12 w-12 items-center justify-center rounded-full bg-[#2B1D13] text-white ring-4 ring-[#FAF8F5]"
                      aria-hidden="true"
                    >
                      <Icon className="h-5 w-5" strokeWidth={1.75} />
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-3">
                      <span className="font-serif text-2xl text-[#B08B6D] leading-none">
                        0{index + 1}
                      </span>
                      <h3 className="text-lg sm:text-xl font-semibold text-[#2B2118]">
                        {title}
                      </h3>
                    </div>
                    <p className="mt-3 text-gray-600 leading-relaxed">{desc}</p>
                  </div>
                </li>
              </AnimateIn>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
