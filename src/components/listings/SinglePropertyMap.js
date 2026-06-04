"use client";

import dynamic from "next/dynamic";

const SinglePropertyMapView = dynamic(() => import("./SinglePropertyMapView"), {
  ssr: false,
  loading: () => (
    <div className="h-[280px] sm:h-[320px] w-full rounded-[20px] bg-[#EDE6DF] animate-pulse flex items-center justify-center text-sm text-gray-500">
      Loading map…
    </div>
  ),
});

export default function SinglePropertyMap({ property }) {
  return (
    <div className="h-[280px] sm:h-[320px] rounded-[20px] overflow-hidden border border-[#E8E0D8] shadow-[0_8px_30px_rgba(43,33,24,0.06)]">
      <SinglePropertyMapView property={property} />
    </div>
  );
}
