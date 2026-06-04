import { HeartHandshake, ShieldCheck, Sparkles, Leaf } from "lucide-react";
import AnimateIn from "../AnimateIn";

const values = [
  {
    icon: ShieldCheck,
    title: "Trust First",
    desc: "Verified homes, transparent pricing and honest service — always. No surprises, no hidden fees.",
  },
  {
    icon: HeartHandshake,
    title: "People-Centred",
    desc: "Our residents and owners are at the heart of everything we do. Real humans, real support.",
  },
  {
    icon: Sparkles,
    title: "Quality, Always",
    desc: "We obsess over the little things — clean spaces, working appliances, and homes that feel cared for.",
  },
  {
    icon: Leaf,
    title: "Calm Living",
    desc: "A home should be a refuge. We design every experience to feel effortless, quiet and welcoming.",
  },
];

export default function AboutValues() {
  return (
    <section
      className="py-16 md:py-20 bg-[#F8F5F1]"
      aria-labelledby="about-values-heading"
    >
      <div className="container mx-auto px-4 lg:px-8">
        <AnimateIn animation="fade-up">
          <header className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
            <span className="uppercase text-sm tracking-[0.2em] text-[#B08B6D] font-medium">
              What We Stand For
            </span>
            <h2
              id="about-values-heading"
              className="text-3xl md:text-4xl font-serif text-[#2B2118] mt-4 leading-snug"
            >
              Values that guide every home we manage.
            </h2>
            <p className="mt-4 text-gray-600 leading-relaxed">
              These aren&apos;t slogans on a wall — they shape how we choose
              homes, train our teams, and serve our residents every single day.
            </p>
          </header>
        </AnimateIn>

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 list-none p-0 m-0">
          {values.map(({ icon: Icon, title, desc }, index) => (
            <AnimateIn
              key={title}
              animation="fade-up"
              delay={index * 110}
              className="contents"
            >
              <li className="group flex h-full flex-col rounded-2xl bg-white p-7 border border-[#EFE7DF] transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EFE7DF] transition-colors group-hover:bg-[#B08B6D]/20"
                  aria-hidden="true"
                >
                  <Icon
                    className="h-6 w-6 text-[#8A6A55]"
                    strokeWidth={1.5}
                  />
                </span>

                <h3 className="mt-6 text-lg font-semibold text-[#2B2118]">
                  {title}
                </h3>
                <p className="mt-3 text-gray-600 leading-relaxed text-sm">
                  {desc}
                </p>
              </li>
            </AnimateIn>
          ))}
        </ul>
      </div>
    </section>
  );
}
