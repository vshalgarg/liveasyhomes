import { Mail, Phone, MapPin } from "lucide-react";
import AnimateIn from "../AnimateIn";

const quickPoints = [
  { icon: Phone, label: "Call us anytime" },
  { icon: Mail, label: "Reply within 24 hours" },
  { icon: MapPin, label: "Delhi NCR, India" },
];

export default function ContactHero() {
  return (
    <section
      className="relative overflow-hidden bg-[#F8F5F1] pt-12 pb-16 md:pt-20 md:pb-24"
      aria-labelledby="contact-hero-heading"
    >
      <div
        className="pointer-events-none absolute -top-32 -left-24 h-72 w-72 rounded-full bg-[#EFE7DF] blur-3xl opacity-70"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-[#E8DFD6] blur-3xl opacity-60"
        aria-hidden="true"
      />

      <div className="relative container mx-auto px-4 lg:px-8">
        <div className="max-w-3xl">
          <AnimateIn animation="fade-down" immediate>
            <span className="inline-block bg-[#EFE7DF] text-[#8A6A55] text-xs tracking-[0.2em] font-semibold px-4 py-2 rounded-full mb-6 uppercase">
              Get in Touch
            </span>
          </AnimateIn>

          <AnimateIn animation="fade-up" immediate delay={120}>
            <h1
              id="contact-hero-heading"
              className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-serif leading-tight text-[#2B2118]"
            >
              We&apos;d love to <span className="italic text-[#B08B6D]">hear</span>{" "}
              from you.
            </h1>
          </AnimateIn>

          <AnimateIn animation="fade-up" immediate delay={220}>
            <p className="mt-6 text-gray-600 text-lg leading-relaxed max-w-2xl">
              Whether you&apos;re looking for your next home, have a question about
              one of our managed properties, or simply want to say hello — our
              team is here to help.
            </p>
          </AnimateIn>

          <AnimateIn animation="fade-up" immediate delay={320}>
            <ul className="mt-8 flex flex-wrap gap-3">
              {quickPoints.map(({ icon: Icon, label }) => (
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
      </div>
    </section>
  );
}
