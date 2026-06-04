import { Building2, Shield, Users } from "lucide-react";
import AnimateIn from "./AnimateIn";

const iconClass = "mx-auto h-12 w-12 sm:h-16 sm:w-16 text-[#8A6A55]";

const features = [
  {
    title: "Verified Homes",
    desc: "Every home is verified for quality, safety & comfort.",
    icon: Shield,
  },
  {
    title: "Trusted Tenants",
    desc: "We ensure a community you can feel safe in.",
    icon: Users,
  },
  {
    title: "Hassle-free Process",
    desc: "From booking to moving, we handle everything.",
    icon: Building2,
  },
];

export default function FeaturesSection() {
  return (
    <section
      className="py-16 md:py-20 bg-[#FAF8F5]"
      aria-labelledby="features-heading"
    >
      <div className="container mx-auto px-4 lg:px-8">
        <AnimateIn animation="fade-up">
          <header className="text-center mb-10 md:mb-14">
            <p className="text-sm uppercase tracking-widest text-[#B08B6D]">
              Trusted by thousands
            </p>

            <h2
              id="features-heading"
              className="text-3xl md:text-4xl font-serif mt-3 text-[#2B2118]"
            >
              Better living. Effortless renting.
            </h2>
          </header>
        </AnimateIn>

        <ul className="grid grid-cols-1 md:grid-cols-3 list-none p-0 m-0">
          {features.map((item, index) => {
            const Icon = item.icon;
            return (
              <AnimateIn
                key={item.title}
                animation="fade-up"
                delay={index * 120}
                className="contents"
              >
                <li
                  className={`px-6 py-8 text-center h-full transition-colors duration-300 hover:bg-white/40 ${
                    index < features.length - 1
                      ? "border-b border-[#E0D6CC] md:border-b-0 md:border-r"
                      : ""
                  }`}
                >
                  <Icon
                    className={`${iconClass} transition-transform duration-500 group-hover:scale-110`}
                    strokeWidth={1.25}
                    aria-hidden="true"
                  />
                  <h3 className="text-lg sm:text-xl font-semibold text-[#2B2118] mt-6">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 mt-4 leading-relaxed max-w-xs mx-auto">
                    {item.desc}
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
