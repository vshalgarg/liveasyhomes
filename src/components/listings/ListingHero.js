import Link from "next/link";
import AnimateIn from "@/components/AnimateIn";

export default function ListingHero({ totalCount }) {
  return (
    <section
      className="relative bg-[#F8F5F1] pt-5 pb-2 md:pt-6 md:pb-3 overflow-hidden"
      aria-labelledby="listings-page-title"
    >
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute -top-16 right-0 h-48 w-48 rounded-full bg-[#EFE7DF]/70 blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4 lg:px-8">
        <nav aria-label="Breadcrumb" className="mb-3">
          <ol className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-500 list-none p-0 m-0">
            <li>
              <Link href="/home" className="hover:text-[#8A6A55] transition">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-[#2B2118] font-medium" aria-current="page">
              Properties
            </li>
          </ol>
        </nav>

        <AnimateIn animation="fade-up" immediate>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <h1
                id="listings-page-title"
                className="text-2xl sm:text-3xl md:text-[2.35rem] font-serif text-[#2B2118] leading-tight tracking-tight"
              >
                Find your next{" "}
                <span className="italic text-[#B08B6D]">calm</span> place
              </h1>
              <p className="mt-1.5 text-sm sm:text-base text-gray-600 max-w-xl leading-snug">
                Verified homes across Delhi &amp; Faridabad — filter, explore the
                map, book a free visit.
              </p>
            </div>

            <dl className="flex shrink-0 items-center gap-4 sm:gap-5 text-sm list-none p-0 m-0">
              <div className="flex items-baseline gap-1.5">
                <dt className="sr-only">Total properties</dt>
                <dd className="text-lg font-semibold text-[#2B2118] m-0 tabular-nums">
                  {totalCount == null ? "—" : `${totalCount}+`}
                </dd>
                <dd className="text-gray-500 m-0 font-normal">homes</dd>
              </div>
              <span
                className="h-4 w-px bg-[#D7CEC7]"
                aria-hidden="true"
              />
              <div className="flex items-baseline gap-1.5">
                <dt className="sr-only">Cities</dt>
                <dd className="text-lg font-semibold text-[#2B2118] m-0">3+</dd>
                <dd className="text-gray-500 m-0 font-normal">cities</dd>
              </div>
              <span
                className="hidden sm:block h-4 w-px bg-[#D7CEC7]"
                aria-hidden="true"
              />
              <div className="hidden sm:flex items-baseline gap-1.5">
                <dt className="sr-only">Rating</dt>
                <dd className="text-lg font-semibold text-[#2B2118] m-0">
                  4.8
                </dd>
                <dd className="text-gray-500 m-0 font-normal">rating</dd>
              </div>
            </dl>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
