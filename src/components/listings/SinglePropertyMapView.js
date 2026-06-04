"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

function createMarkerIcon() {
  return L.divIcon({
    className: "listing-map-marker",
    html: `<span class="listing-map-marker-pin" aria-hidden="true"></span>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });
}

export default function SinglePropertyMapView({ property }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !property?.lat) return undefined;

    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    if (container._leaflet_id) {
      delete container._leaflet_id;
    }

    const map = L.map(container, { scrollWheelZoom: false }).setView(
      [property.lat, property.lng],
      15
    );

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    L.marker([property.lat, property.lng], { icon: createMarkerIcon() }).addTo(
      map
    );

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      if (container._leaflet_id) {
        delete container._leaflet_id;
      }
    };
  }, [property]);

  return (
    <div
      ref={containerRef}
      className="h-full w-full z-0"
      role="img"
      aria-label={`Map showing ${property.title} in ${property.location}`}
    />
  );
}
