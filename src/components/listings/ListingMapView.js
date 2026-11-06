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
    popupAnchor: [0, -30],
  });
}

function buildPopupHtml(property) {
  return `
    <div style="min-width:180px;padding:4px;font-family:system-ui,sans-serif;">
      <p style="margin:0;font-weight:600;font-size:14px;color:#2B2118;">${property.title}</p>
      <p style="margin:4px 0 0;font-size:12px;color:#6b7280;">${property.location}</p>
      <p style="margin:8px 0 0;font-size:14px;font-weight:500;color:#8A6A55;">₹${property.price}/mo</p>
      <a href="/listings/${property.id}" style="display:inline-block;margin-top:8px;font-size:12px;font-weight:500;color:#2B2118;text-decoration:underline;">View details</a>
    </div>
  `;
}

export default function ListingMapView({ properties }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !properties.length) return undefined;

    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    if (container._leaflet_id) {
      delete container._leaflet_id;
    }

    const points = properties.map((p) => [p.lat, p.lng]);
    const bounds = L.latLngBounds(points);
    const icon = createMarkerIcon();

    const map = L.map(container, { scrollWheelZoom: false }).fitBounds(bounds, {
      padding: [56, 56],
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    properties.forEach((property) => {
      L.marker([property.lat, property.lng], { icon })
        .addTo(map)
        .bindPopup(buildPopupHtml(property));
    });

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
  }, [properties]);

  if (!properties.length) return null;

  return (
    <div
      ref={containerRef}
      className="h-full w-full z-0"
      role="application"
      aria-label="Map showing property locations"
    />
  );
}
