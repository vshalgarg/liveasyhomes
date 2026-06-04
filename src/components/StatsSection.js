import { Building2, Home, MapPin, Star } from "lucide-react";
import AnimateIn from "./AnimateIn";

const iconClass = "mx-auto h-10 w-10 text-[#8A6A55]";

const stats = [
  { value: "10,000+", label: "Happy Residents", icon: Home },
  { value: "500+", label: "Quality Homes", icon: Building2 },
  { value: "12+", label: "Cities", icon: MapPin },
  { value: "4.8/5", label: "Customer Rating", icon: Star },
];

export default function StatsSection() {
  return (
    <section className="pb-16 md:pb-20 bg-[#FAF8F5]" aria-label="LiveEasy Homes statistics">
      <div className="container mx-auto px-4 lg:px-8">
        <ul className="rounded-2xl bg-[#F7F3EE] border border-[#E8E0D8] px-4 py-8 sm:px-6 sm:py-10 md:px-10 md:py-12 grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-0 list-none m-0">
          {stats.map((item, index) => {
            const Icon = item.icon;
            return (
              <AnimateIn
                key={item.label}
                animation="fade-up"
                delay={index * 100}
                className={`contents ${
                  index < stats.length - 1
                    ? "[&>li]:lg:border-r [&>li]:lg:border-[#E0D6CC]"
                    : ""
                } ${
                  index % 2 === 0 && index < stats.length - 1
                    ? "[&>li]:max-lg:border-r [&>li]:max-lg:border-[#E0D6CC]"
                    : ""
                } ${
                  index >= 2
                    ? "[&>li]:max-lg:pt-6 [&>li]:max-lg:border-t [&>li]:max-lg:border-[#E0D6CC] sm:[&>li]:max-lg:pt-8"
                    : ""
                }`}
              >
                <li className="text-center px-2 sm:px-4 list-none">
                  <Icon
                    className={`${iconClass} mb-4`}
                    strokeWidth={1.25}
                    aria-hidden="true"
                  />
                  <p className="text-xl sm:text-2xl md:text-3xl font-semibold text-[#2B2118]">
                    <span className="sr-only">{item.label}: </span>
                    {item.value}
                  </p>
                  <p className="mt-2 text-sm md:text-base text-[#2B2118]">
                    {item.label}
                  </p>
                </li>
              </AnimateIn>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
