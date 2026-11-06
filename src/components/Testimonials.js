"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, User } from "lucide-react";
import readyToFind from "../../public/ready_to_find.png";
import AnimateIn from "./AnimateIn";

const testimonials = [
  {
    id: "rahul-patil",
    name: "Rahul Patil",
    city: "Faridabad",
    type: "Tenant",
    review:
      "LiveEasy Homes made finding my ideal home so easy. The team is professional, friendly and very supportive.",
  },
  {
    id: "ayush",
    name: "Ayush",
    city: "South-Ex, Delhi",
    type: "Tenant",
    review:
      "The whole process was smooth and transparent. I love my new home!",
  },
  {
    id: "santosh",
    name: "Santosh",
    city: "Dwarka, Delhi",
    type: "Tenant",
    review:
      "Great homes, great people and amazing support. Highly recommended!",
  },
  {
    id: "kavya-nair",
    name: "Pankaj Kaswan",
    city: "Kalka Ji, Delhi",
    type: "Tenant",
    review:
      "From the first visit to move-in, everything felt organised. I found a calm, verified home without endless broker calls.",
  },
  {
    id: "rohan-mehta",
    name: "Ashutosh Bhati",
    city: "Faridabad",
    type: "Tenant",
    review:
      "Booking a free visit was simple and the team answered every question. Settling into my apartment was stress-free.",
  },
  {
    id: "meera-sharma",
    name: "Shilpa Bhasak",
    city: "Faridabad",
    type: "House Owner",
    review:
      "Listing with LiveEasy was effortless. They screened tenants carefully and I get reliable rent without follow-ups.",
  },
  {
    id: "vikram-singh",
    name: "Gurpreet Sondhi",
    city: "Faridabad",
    type: "House Owner",
    review:
      "As a house owner, I finally feel my property is in good hands — clear communication and professional management throughout.",
  },
  {
    id: "anita-desai",
    name: "Thresiamma Isac",
    city: "Dwarka, Delhi",
    type: "House Owner",
    review:
      "LiveEasy handles visits, tenants, and upkeep so I don’t have to. Peace of mind and consistent occupancy for my home.",
  },
  {
    id: "suresh-iyer",
    name: "Dhruv Singh",
    city: "Tilak Nagar, Delhi",
    type: "House Owner",
    review:
      "I listed my flat once and LiveEasy took care of the rest — quality tenants, timely updates, and zero drama.",
  },
  {
    id: "pooja-kapoor",
    name: "Divya Suri",
    city: "South-Ex, Delhi",
    type: "House Owner",
    review:
      "Professional team and fair process. My property stays occupied with tenants I trust, and I barely need to intervene.",
  },
];

/** Alternate Tenant → House Owner → Tenant → … */
function interleaveByType(items) {
  const tenants = items.filter((item) => item.type === "Tenant");
  const owners = items.filter((item) => item.type === "House Owner");
  const ordered = [];
  const max = Math.max(tenants.length, owners.length);
  for (let i = 0; i < max; i += 1) {
    if (tenants[i]) ordered.push(tenants[i]);
    if (owners[i]) ordered.push(owners[i]);
  }
  return ordered;
}

const orderedTestimonials = interleaveByType(testimonials);
const marqueeItems = [...orderedTestimonials, ...orderedTestimonials];

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
    <figure className="flex h-full w-[300px] sm:w-[340px] flex-col rounded-2xl bg-white p-6 sm:p-8 shadow-sm ring-1 ring-[#EFE7DF]">
      <div className="flex items-start justify-between gap-3">
        <QuoteMark />
        <span className="shrink-0 rounded-full bg-[#F7F3EE] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8A6A55]">
          {item.type}
        </span>
      </div>
      <blockquote className="mt-4 flex-1">
        <p className="text-[#4A4A4A] leading-relaxed text-sm sm:text-base line-clamp-5">
          {item.review}
        </p>
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-3">
        <div
          className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-[#EFE7DF] text-[#8A6A55] flex items-center justify-center"
          aria-hidden="true"
        >
          <User className="h-5 w-5" strokeWidth={1.75} />
        </div>
        <div className="min-w-0">
          <cite className="not-italic font-semibold text-[#2B2118] block truncate">
            {item.name}
          </cite>
          <p className="text-sm text-gray-500 truncate">{item.city}</p>
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

        <div
          className="testimonial-marquee relative overflow-hidden"
          aria-label="Scrolling testimonials from tenants and house owners"
        >
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 sm:w-12 bg-gradient-to-r from-[#F3F1EE] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 sm:w-12 bg-gradient-to-l from-[#F3F1EE] to-transparent" />

          <div className="testimonial-marquee-track flex gap-5">
            {marqueeItems.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                className="shrink-0 h-[280px]"
                aria-hidden={index >= orderedTestimonials.length}
              >
                <TestimonialCard item={item} />
              </div>
            ))}
          </div>
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
