import Link from "next/link";
import { ArrowRight, HelpCircle, Home } from "lucide-react";
import AnimateIn from "../AnimateIn";

const cards = [
  {
    icon: Home,
    title: "Browse Verified Homes",
    desc: "Discover thoughtfully curated rental homes across our network.",
    href: "/listings",
    cta: "Explore Listings",
  },
  {
    icon: HelpCircle,
    title: "How LiveEasy Works",
    desc: "Learn how we manage properties so you can move in worry-free.",
    href: "/about",
    cta: "Learn More",
  },
];

export default function ContactCTA() {
  return (
    <section
      className="bg-[#FAF8F5] py-16 md:py-20"
      aria-labelledby="contact-cta-heading"
    >
      <div className="container mx-auto px-4 lg:px-8">
        <AnimateIn animation="fade-up">
          <header className="text-center max-w-2xl mx-auto mb-12">
            <span className="uppercase text-xs tracking-[0.25em] text-[#B08B6D] font-semibold">
              Helpful Next Steps
            </span>
            <h2
              id="contact-cta-heading"
              className="mt-3 text-3xl md:text-4xl font-serif text-[#2B2118] leading-snug"
            >
              Looking for something else?
            </h2>
            <p className="mt-4 text-gray-600 leading-relaxed">
              While you wait to hear back, here are a few places you might find
              what you need.
            </p>
          </header>
        </AnimateIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {cards.map(({ icon: Icon, title, desc, href, cta }, index) => (
            <AnimateIn
              key={title}
              animation="fade-up"
              delay={120 + index * 100}
            >
              <Link
                href={href}
                className="group flex h-full flex-col rounded-2xl border border-[#E8DFD6] bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-[#D7CEC7]"
              >
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EFE7DF]"
                  aria-hidden="true"
                >
                  <Icon
                    className="h-6 w-6 text-[#8A6A55]"
                    strokeWidth={1.5}
                  />
                </span>

                <h3 className="mt-6 text-xl font-serif text-[#2B2118]">
                  {title}
                </h3>
                <p className="mt-3 text-gray-600 leading-relaxed">{desc}</p>

                <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#2B1D13]">
                  {cta}
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
