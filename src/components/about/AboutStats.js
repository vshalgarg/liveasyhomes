import { Building2, Home, MapPin, Star } from "lucide-react";
import AnimateIn from "../AnimateIn";

const iconClass = "mx-auto h-10 w-10 text-[#E8C9A8]";

const stats = [
  { value: "100+", label: "Happy Residents", icon: Home },
  { value: "50+", label: "Quality Homes", icon: Building2 },
  { value: "3+", label: "Cities Served", icon: MapPin },
  { value: "4.8/5", label: "Customer Rating", icon: Star },
];

export default function AboutStats() {
  return (
    <section
      className="relative bg-[#F8F5F1] py-16 md:py-20"
      aria-label="LiveEasy Homes achievements"
    >
      <div className="container mx-auto px-4 lg:px-8">
        <AnimateIn animation="fade-up">
          <header className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
            <span className="uppercase text-sm tracking-[0.2em] text-[#B08B6D] font-medium">
              Our Impact
            </span>
            <h2 className="text-3xl md:text-4xl font-serif text-[#2B2118] mt-4 leading-snug">
              Trusted by many across Delhi-NCR.
            </h2>
          </header>
        </AnimateIn>

        <AnimateIn animation="fade-up" delay={100}>
          <ul className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2B1D13] via-[#3A2A1E] to-[#5A4334] px-4 py-10 sm:px-6 sm:py-12 md:px-10 md:py-14 grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 list-none m-0 text-white">
            <div
              className="pointer-events-none absolute -top-24 -right-20 h-64 w-64 rounded-full bg-[#B08B6D]/25 blur-3xl"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-[#8A6A55]/20 blur-3xl"
              aria-hidden="true"
            />

            {stats.map((item, index) => {
              const Icon = item.icon;
              return (
                <li
                  key={item.label}
                  className={`relative text-center px-2 sm:px-4 list-none ${
                    index < stats.length - 1
                      ? "lg:border-r lg:border-white/15"
                      : ""
                  }`}
                >
                  <Icon
                    className={`${iconClass} mb-4`}
                    strokeWidth={1.25}
                    aria-hidden="true"
                  />
                  <p className="text-2xl sm:text-3xl md:text-4xl font-serif text-white">
                    <span className="sr-only">{item.label}: </span>
                    {item.value}
                  </p>
                  <p className="mt-2 text-sm md:text-base text-white/75">
                    {item.label}
                  </p>
                </li>
              );
            })}
          </ul>
        </AnimateIn>
      </div>
    </section>
  );
}
