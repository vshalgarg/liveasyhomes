import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import readyToFind from "../../public/ready_to_find.png";
import AnimateIn from "./AnimateIn";

const testimonials = [
  {
    id: "neha-r",
    name: "Neha R.",
    city: "Bangalore",
    review:
      "LiveEasy Homes made finding my ideal home so easy. The team is professional, friendly and very supportive.",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: "arjun-s",
    name: "Arjun S.",
    city: "Bangalore",
    review:
      "The whole process was smooth and transparent. I love my new home!",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: "priya-m",
    name: "Priya M.",
    city: "Bangalore",
    review:
      "Great homes, great people and amazing support. Highly recommended!",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
  },
];

function QuoteMark() {
  return (
    <span
      className="block text-4xl leading-none font-serif text-[#7A2E3A]"
      aria-hidden="true"
    >
      &ldquo;
    </span>
  );
}

function TestimonialCard({ item }) {
  return (
    <figure className="flex h-full flex-col rounded-2xl bg-white p-8 transition-shadow duration-300 hover:shadow-lg h-full">
      <QuoteMark />
      <blockquote className="mt-4 flex-1">
        <p className="text-[#4A4A4A] leading-relaxed">{item.review}</p>
      </blockquote>
      <figcaption className="mt-8 flex items-center gap-3">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full">
          <Image
            src={item.avatar}
            alt={`${item.name}, LiveEasy Homes client from ${item.city}`}
            fill
            sizes="48px"
            className="object-cover"
          />
        </div>
        <div>
          <cite className="not-italic font-semibold text-[#2B2118]">
            {item.name}
          </cite>
          <p className="text-sm text-gray-500">{item.city}</p>
        </div>
      </figcaption>
    </figure>
  );
}

export default function Testimonials() {
  return (
    <section
      className="py-16 md:py-20 bg-[#F3F1EE]"
      aria-labelledby="testimonials-heading"
    >
      <div className="container mx-auto px-4 lg:px-8">
        <AnimateIn animation="fade-up">
          <header className="text-center mb-10 md:mb-14">
            <p className="uppercase text-sm tracking-[0.2em] text-[#B08B6D] font-medium">
              What Our Clients Say
            </p>
            <h2
              id="testimonials-heading"
              className="text-3xl md:text-4xl font-serif text-[#2B2118] mt-4 leading-tight"
            >
              Real experiences.
              <br />
              Real happiness.
            </h2>
          </header>
        </AnimateIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((item, index) => (
            <AnimateIn
              key={item.id}
              animation="fade-up"
              delay={index * 120}
              className="contents"
            >
              <div className="h-full">
                <TestimonialCard item={item} />
              </div>
            </AnimateIn>
          ))}
        </div>

        <AnimateIn animation="fade-up" delay={200}>
          <aside
            className="mt-12 md:mt-16 rounded-2xl bg-[#F5F1EE] border border-[#E8E0D8] overflow-hidden transition-shadow duration-300 hover:shadow-md"
            aria-label="Explore homes call to action"
          >
            <div className="flex flex-col md:flex-row md:items-center">
              <div className="relative h-44 sm:h-52 md:h-[200px] md:w-[240px] lg:w-[280px] shrink-0">
                <Image
                  src={readyToFind}
                  alt="Cozy living room with plant and furniture"
                  fill
                  sizes="(max-width: 768px) 100vw, 280px"
                  className="object-cover object-left"
                />
              </div>

              <div className="flex flex-col gap-6 p-6 sm:p-8 md:flex-row md:items-center md:gap-8 lg:gap-12 lg:p-10 flex-1 min-w-0">
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl md:text-[1.75rem] font-serif text-[#2B2118] leading-snug">
                    Ready to find your calm place?
                  </h3>
                  <p className="mt-2 text-[#4A4A4A] leading-relaxed text-sm sm:text-base max-w-md md:max-w-none mx-auto md:mx-0">
                    Explore our handpicked homes and move in worry-free.
                  </p>
                </div>

                <Link
                  href="/listings"
                  className="inline-flex shrink-0 self-center md:self-auto min-h-[44px] items-center justify-center gap-2 bg-[#231F20] hover:bg-[#2B2118] text-white px-6 py-3 rounded-full transition-all duration-300 text-sm font-medium whitespace-nowrap hover:scale-[1.02] active:scale-[0.98]"
                >
                  Explore Homes
                  <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </aside>
        </AnimateIn>
      </div>
    </section>
  );
}
