import Image from "next/image";
import Link from "next/link";
import homeBanner from "../../public/home_banner.png";
import AnimateIn from "./AnimateIn";

export default function HomeBanner() {
  return (
    <section
      className="relative bg-[#F8F5F1] pt-10 lg:pt-16 overflow-hidden"
      aria-label="Home Banner"
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <AnimateIn animation="fade-down" immediate delay={0}>
              <span className="inline-block bg-[#EFE7DF] text-[#8A6A55] text-xs tracking-wide font-semibold px-4 py-2 rounded-full mb-6 uppercase">
                Welcome To LiveEasy Homes
              </span>
            </AnimateIn>

            <AnimateIn animation="fade-up" immediate delay={120}>
              <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-serif leading-tight text-[#2B2118]">
                Find a home that feels like your{" "}
                <span className="italic text-[#B08B6D]">calm</span> place.
              </h1>
            </AnimateIn>

            <AnimateIn animation="fade-up" immediate delay={220}>
              <p className="mt-6 text-gray-600 text-lg leading-relaxed max-w-lg">
                Thoughtfully curated homes professionally managed for your peace
                of mind.
              </p>
            </AnimateIn>

            <AnimateIn animation="fade-up" immediate delay={320}>
              <div className="flex flex-wrap gap-4 mt-8">
                <Link
                  href="/listings"
                  className="inline-flex min-h-[44px] items-center justify-center bg-[#2B1D13] hover:bg-[#3a2a1e] text-white px-6 py-3 rounded-full transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Explore Homes
                </Link>

                <Link
                  href="/about"
                  className="inline-flex min-h-[44px] items-center justify-center border border-[#D7CEC7] px-6 py-3 rounded-full hover:bg-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                  How It Works
                </Link>
              </div>
            </AnimateIn>
          </div>

          <AnimateIn animation="fade-left" immediate delay={200} duration={800}>
            <div className="relative h-[350px] md:h-[500px] lg:h-[650px] rounded-[32px] overflow-hidden shadow-lg">
              <Image
                src={homeBanner}
                alt="Luxury apartment living room"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </AnimateIn>
        </div>
      </div>
    </section>
  );
}
