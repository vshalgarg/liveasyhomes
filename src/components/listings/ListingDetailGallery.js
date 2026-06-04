"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import { ChevronLeft, ChevronRight, Images, ZoomIn } from "lucide-react";
import GalleryLightbox from "./GalleryLightbox";

export default function ListingDetailGallery({ images, alt }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const goTo = useCallback(
    (index) => {
      setActiveIndex((index + images.length) % images.length);
    },
    [images.length]
  );

  const openLightbox = useCallback((index) => {
    setActiveIndex(index);
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  if (!images?.length) return null;

  const extraCount = Math.max(0, images.length - 4);

  const getBentoItems = (active) => [
    { src: images[active], index: active },
    ...images
      .map((src, i) => ({ src, index: i }))
      .filter(({ index }) => index !== active)
      .slice(0, 3),
  ];

  const bentoItems = getBentoItems(activeIndex);

  return (
    <>
      <div className="w-full">
        {/* Mobile: compact swipe strip */}
        <div
          className="md:hidden relative rounded-2xl overflow-hidden bg-[#EDE6DF] border border-[#E8E0D8]/80"
          aria-roledescription="carousel"
          aria-label={`${alt} photo gallery`}
        >
          <div className="relative h-48 sm:h-52 group">
            <button
              type="button"
              onClick={() => openLightbox(activeIndex)}
              className="absolute inset-0 z-[1] cursor-zoom-in"
              aria-label={`Enlarge photo ${activeIndex + 1}`}
            >
              <Image
                src={images[activeIndex]}
                alt={`${alt} — photo ${activeIndex + 1} of ${images.length}`}
                fill
                priority
                sizes="100vw"
                className="object-cover pointer-events-none"
              />
            </button>

            <span className="absolute top-2 left-2 z-[2] flex items-center gap-1 rounded-full bg-[#2B2118]/55 backdrop-blur-sm px-2.5 py-1 text-[10px] font-medium text-white pointer-events-none">
              <ZoomIn className="h-3 w-3" aria-hidden="true" />
              Tap to enlarge
            </span>

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goTo(activeIndex - 1);
                  }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-10 flex h-9 w-9 min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-white/90 text-[#2B2118] shadow"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goTo(activeIndex + 1);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-10 flex h-9 w-9 min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-white/90 text-[#2B2118] shadow"
                  aria-label="Next photo"
                >
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </button>
                <div className="absolute bottom-2 right-2 z-10 rounded-full bg-[#2B2118]/70 px-2.5 py-1 text-[11px] font-medium text-white pointer-events-none">
                  {activeIndex + 1} / {images.length}
                </div>
              </>
            )}
          </div>

          {images.length > 1 && (
            <div
              className="flex gap-1.5 p-2 overflow-x-auto scrollbar-hide bg-[#FAF8F5]/90"
              role="tablist"
              aria-label="Gallery thumbnails"
            >
              {images.map((src, index) => (
                <button
                  key={src}
                  type="button"
                  role="tab"
                  aria-selected={index === activeIndex}
                  aria-label={`Enlarge photo ${index + 1}`}
                  onClick={() => openLightbox(index)}
                  className={`relative shrink-0 h-12 w-16 rounded-lg overflow-hidden border-2 transition-all ${
                    index === activeIndex
                      ? "border-[#8A6A55]"
                      : "border-transparent opacity-60"
                  }`}
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Desktop: compact bento grid */}
        <div
          className="hidden md:grid grid-cols-4 grid-rows-2 gap-2 h-[240px] lg:h-[260px] rounded-2xl overflow-hidden"
          role="group"
          aria-label={`${alt} photo gallery`}
        >
          {bentoItems.map(({ src, index: imageIndex }, slot) => {
            const isMain = slot === 0;
            const isLastWithMore = slot === 3 && extraCount > 0;

            return (
              <button
                key={`${src}-${imageIndex}`}
                type="button"
                onClick={() => openLightbox(imageIndex)}
                className={`relative overflow-hidden bg-[#EDE6DF] group cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8A6A55] focus-visible:ring-offset-2 ${
                  isMain ? "col-span-2 row-span-2" : ""
                } ${
                  imageIndex === activeIndex
                    ? "ring-2 ring-inset ring-[#8A6A55] z-[1]"
                    : "hover:opacity-95"
                }`}
                aria-label={`Enlarge photo ${imageIndex + 1}`}
              >
                <Image
                  src={src}
                  alt={`${alt} — photo ${imageIndex + 1}`}
                  fill
                  priority={isMain}
                  sizes={isMain ? "(max-width: 1024px) 50vw, 400px" : "200px"}
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <span className="absolute bottom-2 right-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/85 text-[#2B2118] opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                  <ZoomIn className="h-4 w-4" aria-hidden="true" />
                </span>
                {isLastWithMore && (
                  <span className="absolute inset-0 flex items-center justify-center bg-[#2B2118]/50 text-white text-sm font-medium gap-1.5">
                    <Images className="h-4 w-4" aria-hidden="true" />
                    +{extraCount} more
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Desktop: thumbnail strip */}
        {images.length > 1 && (
          <div
            className="hidden md:flex mt-2 gap-2 overflow-x-auto scrollbar-hide"
            role="tablist"
            aria-label="All photos"
          >
            {images.map((src, index) => (
              <button
                key={src}
                type="button"
                role="tab"
                aria-selected={index === activeIndex}
                aria-label={`Enlarge photo ${index + 1}`}
                onClick={() => openLightbox(index)}
                className={`relative shrink-0 h-14 w-[4.5rem] rounded-lg overflow-hidden border-2 transition-all cursor-zoom-in ${
                  index === activeIndex
                    ? "border-[#8A6A55] opacity-100"
                    : "border-transparent opacity-55 hover:opacity-80"
                }`}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="72px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <GalleryLightbox
        images={images}
        alt={alt}
        activeIndex={activeIndex}
        isOpen={lightboxOpen}
        onClose={closeLightbox}
        onNavigate={goTo}
      />
    </>
  );
}
