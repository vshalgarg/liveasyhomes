import Image from "next/image";
import AnimateIn from "../AnimateIn";

const paragraphs = [
  "LiveEasy Homes was started with a simple idea — renting a home in India should feel calm, not chaotic. Too many tenants spend weeks navigating brokers, surprises, and uncertainty before they ever settle in. We knew it could be better.",
  "We work directly with property owners and on-ground teams to bring you a curated portfolio of verified rental homes. Every listing is inspected, every detail double-checked, and every move-in is supported by people who care.",
  "Today, we help thousands of residents across Delhi-NCR find homes they love — and we manage those homes professionally so owners and tenants can both rest easy.",
];

export default function AboutStory() {
  return (
    <section
      className="py-16 md:py-20 bg-[#FAF8F5]"
      aria-labelledby="about-story-heading"
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <AnimateIn animation="fade-right" duration={750}>
            <div className="relative">
              <div className="relative h-[300px] sm:h-[420px] md:h-[500px] rounded-3xl overflow-hidden shadow-md">
                <Image
                  src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1100&q=80"
                  alt="Bright, modern apartment interior with warm wooden tones"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>

              <div
                className="hidden md:block absolute -bottom-8 -right-6 lg:-right-10 rounded-2xl bg-white px-6 py-5 shadow-lg ring-1 ring-[#EFE7DF] max-w-[260px]"
                aria-hidden="true"
              >
                <p className="text-3xl font-serif text-[#2B2118]">100+</p>
                <p className="mt-1 text-sm text-gray-600">
                  Residents living easy across Delhi-NCR
                </p>
              </div>
            </div>
          </AnimateIn>

          <div>
            <AnimateIn animation="fade-up" delay={80}>
              <span className="uppercase text-sm tracking-[0.2em] text-[#B08B6D] font-medium">
                Who We Are
              </span>

              <h2
                id="about-story-heading"
                className="text-3xl md:text-4xl font-serif leading-snug text-[#2B2118] mt-4"
              >
                Built around calm,{" "}
                <span className="italic text-[#B08B6D]">comfort</span>, and
                trust.
              </h2>
            </AnimateIn>

            <div className="mt-8 space-y-5">
              {paragraphs.map((text, index) => (
                <AnimateIn
                  key={index}
                  animation="fade-left"
                  delay={140 + index * 90}
                >
                  <p className="text-gray-600 leading-relaxed">{text}</p>
                </AnimateIn>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
