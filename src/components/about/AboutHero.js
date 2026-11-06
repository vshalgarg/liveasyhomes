import Image from "next/image";
import { ShieldCheck, Sparkles, Users } from "lucide-react";
import AnimateIn from "../AnimateIn";

const highlights = [
  { icon: ShieldCheck, label: "Verified Homes" },
  { icon: Users, label: "Trusted Community" },
  { icon: Sparkles, label: "Hassle-free Living" },
];

export default function AboutHero() {
  return (
    <section
      className="relative overflow-hidden bg-[#F8F5F1] pt-12 pb-16 md:pt-20 md:pb-24"
      aria-labelledby="about-hero-heading"
    >
      <div
        className="pointer-events-none absolute -top-28 -left-24 h-72 w-72 rounded-full bg-[#EFE7DF] blur-3xl opacity-70"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-28 -right-16 h-80 w-80 rounded-full bg-[#E8DFD6] blur-3xl opacity-60"
        aria-hidden="true"
      />

      <div className="relative container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div>
            <AnimateIn animation="fade-down" immediate>
              <span className="inline-block bg-[#EFE7DF] text-[#8A6A55] text-xs tracking-[0.2em] font-semibold px-4 py-2 rounded-full mb-6 uppercase">
                About LiveEasy Homes
              </span>
            </AnimateIn>

            <AnimateIn animation="fade-up" immediate delay={120}>
              <h1
                id="about-hero-heading"
                className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-serif leading-tight text-[#2B2118]"
              >
                Homes that feel{" "}
                <span className="italic text-[#B08B6D]">like home</span> — from
                the moment you arrive.
              </h1>
            </AnimateIn>

            <AnimateIn animation="fade-up" immediate delay={220}>
              <p className="mt-6 text-gray-600 text-lg leading-relaxed max-w-xl">
                LiveEasy Homes is a thoughtfully curated network of
                professionally managed rental homes across Delhi-NCR. We blend the
                comfort of a great home with the simplicity of modern service
                so you can move in, settle down, and just live.
              </p>
            </AnimateIn>

            <AnimateIn animation="fade-up" immediate delay={320}>
              <ul className="mt-8 flex flex-wrap gap-3">
                {highlights.map(({ icon: Icon, label }) => (
                  <li
                    key={label}
                    className="inline-flex items-center gap-2 rounded-full border border-[#E8DFD6] bg-white/70 backdrop-blur px-4 py-2 text-sm text-[#2B2118]"
                  >
                    <Icon
                      className="h-4 w-4 text-[#B08B6D]"
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                    {label}
                  </li>
                ))}
              </ul>
            </AnimateIn>
          </div>

          <AnimateIn animation="fade-left" immediate delay={200} duration={800}>
            <div className="relative h-[320px] sm:h-[420px] md:h-[520px] rounded-[28px] overflow-hidden shadow-lg">
              <Image
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
                alt="Sunlit modern living room with cozy seating"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute bottom-5 left-5 right-5 rounded-2xl bg-white/85 backdrop-blur p-4 sm:p-5 shadow-sm">
                <p className="text-xs uppercase tracking-[0.18em] text-[#B08B6D] font-semibold">
                  Our Promise
                </p>
                <p className="mt-1.5 text-sm sm:text-base text-[#2B2118] leading-relaxed">
                  Every home is hand-checked for quality, safety and comfort —
                  before we ever invite you in.
                </p>
              </div>
            </div>
          </AnimateIn>
        </div>
      </div>
    </section>
  );
}
