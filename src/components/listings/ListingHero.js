import Link from "next/link";
import AnimateIn from "@/components/AnimateIn";

export default function ListingHero({ totalCount }) {
  return (
    <section
      className="relative bg-[#F8F5F1] pt-8 pb-16 md:pt-12 md:pb-20 overflow-hidden"
      aria-labelledby="listings-page-title"
    >
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute -top-24 right-0 h-72 w-72 rounded-full bg-[#EFE7DF]/60 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-[#E8DFD6]/50 blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4 lg:px-8">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-gray-500 list-none p-0 m-0">
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
          <p className="text-xs sm:text-sm uppercase tracking-[0.2em] text-[#B08B6D] font-medium">
            Curated Rentals
          </p>
          <h1
            id="listings-page-title"
            className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-serif text-[#2B2118] mt-4 leading-[1.15] max-w-3xl"
          >
            Find your next{" "}
            <span className="italic text-[#B08B6D]">calm</span> place to live
          </h1>
          <p className="mt-5 text-gray-600 text-base md:text-lg leading-relaxed max-w-2xl">
            Explore{" "}
            {totalCount == null ? "verified" : `${totalCount}+ verified`},
            professionally managed homes across Delhi &amp; Faridabad — designed
            for peaceful, effortless living.
          </p>
        </AnimateIn>

        <AnimateIn animation="fade-up" immediate delay={150}>
          <dl className="mt-10 flex flex-wrap gap-6 md:gap-10 list-none p-0 m-0">
            <div>
              <dt className="sr-only">Total properties</dt>
              <dd className="text-2xl md:text-3xl font-semibold text-[#2B2118] m-0">
                {totalCount == null ? "—" : `${totalCount}+`}
              </dd>
              <dd className="text-sm text-gray-500 mt-1 m-0 font-normal">
                Verified homes
              </dd>
            </div>
            <div>
              <dt className="sr-only">Cities</dt>
              <dd className="text-2xl md:text-3xl font-semibold text-[#2B2118] m-0">
                3+
              </dd>
              <dd className="text-sm text-gray-500 mt-1 m-0 font-normal">
                Cities
              </dd>
            </div>
            <div>
              <dt className="sr-only">Rating</dt>
              <dd className="text-2xl md:text-3xl font-semibold text-[#2B2118] m-0">
                4.8/5
              </dd>
              <dd className="text-sm text-gray-500 mt-1 m-0 font-normal">
                Tenant rating
              </dd>
            </div>
          </dl>
        </AnimateIn>
      </div>
    </section>
  );
}
