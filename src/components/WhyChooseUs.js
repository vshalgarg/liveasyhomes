import Image from "next/image";
import { Check } from "lucide-react";
import AnimateIn from "./AnimateIn";

const points = [
  {
    title: "Curated with Care",
    desc: "We handpick homes that meet our high standards for quality and comfort.",
  },
  {
    title: "Managed with Trust",
    desc: "Professional management so you can live stress-free.",
  },
  {
    title: "Designed for You",
    desc: "Homes that are modern, functional and made for real life.",
  },
  {
    title: "Community First",
    desc: "Join a community of like-minded people and build connections.",
  },
];

function CheckIcon() {
  return (
    <span
      className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#B08B6D]"
      aria-hidden
    >
      <Check className="h-3.5 w-3.5 text-[#B08B6D]" strokeWidth={2.5} />
    </span>
  );
}

export default function WhyChooseUS() {
  return (
    <section
      className="py-16 md:py-20 bg-[#FAF8F5]"
      aria-labelledby="why-choose-heading"
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <AnimateIn animation="fade-right" duration={750}>
            <div className="relative h-[280px] sm:h-[400px] md:h-[480px] lg:h-[520px] rounded-2xl overflow-hidden shadow-md">
              <Image
                src="https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&w=900&q=80"
                alt="Modern apartment dining room"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </AnimateIn>

          <div>
            <AnimateIn animation="fade-up" delay={80}>
              <span className="uppercase text-sm tracking-[0.2em] text-[#B08B6D] font-medium">
                Why Choose Us
              </span>

              <h2
                id="why-choose-heading"
                className="text-3xl md:text-4xl font-serif leading-snug text-[#2B2118] mt-4"
              >
                More than just a home, it&apos;s a better way of living.
              </h2>
            </AnimateIn>

            <ul className="mt-10 space-y-8">
              {points.map((point, index) => (
                <AnimateIn
                  key={point.title}
                  animation="fade-left"
                  delay={160 + index * 90}
                  className="contents"
                >
                  <li className="flex items-start gap-4">
                    <CheckIcon />
                    <div>
                      <h3 className="font-semibold text-lg text-[#2B2118]">
                        {point.title}
                      </h3>
                      <p className="text-gray-600 mt-1.5 leading-relaxed">
                        {point.desc}
                      </p>
                    </div>
                  </li>
                </AnimateIn>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
