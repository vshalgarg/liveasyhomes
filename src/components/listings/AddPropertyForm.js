"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, ImagePlus, Loader2, Plus, X } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { ApiError } from "@/lib/api/client";
import { createProperty, uploadPropertyPhotos } from "@/lib/api/properties";
import {
  AMENITY_OPTIONS,
  MAX_PROPERTY_PHOTOS,
  buildPropertyPayload,
  compressImageFile,
} from "@/lib/propertyForm";
import { richTextToPlain, sanitizeRichText } from "@/lib/richText";
import RichTextEditor from "./RichTextEditor";

const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
const ACCEPTED_PHOTO_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const initialState = {
  title: "",
  location: "",
  lat: "",
  lng: "",
  price: "",
  beds: "2",
  baths: "2",
  area: "",
  propertyType: "Gated Apartment",
  floorPlan: "2 BHK",
  furnished: "Fully furnished",
  availableFrom: "",
  onboardingCharge: "",
  deposit: "2 months rent",
  maintenance: "Included in rent",
  description: "",
  highlights: "",
  rentExcludes: [""],
  liveasyManages: [""],
  ownerResponsibilities: [""],
  termsAndConditions: "",
  amenities: ["wifi", "power", "security", "parking", "ac", "housekeeping"],
  isActive: true,
};

const FLOOR_PLANS = ["1RK", "1 BHK", "2 BHK", "3 BHK", "4 BHK", "5 BHK"];

function bedsFromFloorPlan(floorPlan) {
  if (floorPlan === "1RK") return "1";
  const match = String(floorPlan).match(/^(\d+)\s*BHK$/i);
  return match ? match[1] : "1";
}

function todayIsoDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const inputBase =
  "w-full min-h-[48px] rounded-xl border border-[#E0D6CC] bg-white px-4 py-3 text-[#2B2118] placeholder:text-gray-400 outline-none transition focus:border-[#B08B6D] focus:ring-2 focus:ring-[#B08B6D]/20";

const labelClass = "block text-sm font-medium text-[#2B2118] mb-2";

const MAX_DYNAMIC_ITEMS = 20;

function DynamicItemList({
  id,
  label,
  hint,
  items,
  placeholder,
  error,
  onChange,
}) {
  const updateItem = (index, value) => {
    onChange(items.map((item, itemIndex) => (itemIndex === index ? value : item)));
  };

  return (
    <div>
      <label className={labelClass} htmlFor={`${id}-0`}>
        {label}{" "}
        <span className="text-gray-400 font-normal">{hint}</span>
      </label>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={`${id}-${index}`} className="flex items-center gap-2">
            <input
              id={index === 0 ? `${id}-0` : undefined}
              type="text"
              value={item}
              onChange={(event) => updateItem(index, event.target.value)}
              className={inputBase}
              placeholder={placeholder}
              maxLength={240}
              aria-label={`${label} item ${index + 1}`}
            />
            <button
              type="button"
              onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))}
              className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#E0D6CC] text-[#8A6A55] hover:bg-[#F7F3EE]"
              aria-label={`Remove ${label} item ${index + 1}`}
              disabled={items.length === 1 && !item}
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onChange([...items, ""])}
        disabled={items.length >= MAX_DYNAMIC_ITEMS}
        className="mt-3 inline-flex min-h-[44px] items-center gap-2 rounded-full border border-dashed border-[#B08B6D] px-4 py-2 text-sm font-medium text-[#2B2118] hover:bg-[#F7F3EE] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
        Add item
      </button>
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  );
}

function itemListError(items, label) {
  const filled = (items || []).map((item) => String(item).trim()).filter(Boolean);
  if (filled.length > MAX_DYNAMIC_ITEMS) {
    return `You can add up to ${MAX_DYNAMIC_ITEMS} items under ${label}.`;
  }
  if (filled.some((item) => item.length > 240)) {
    return `Each item under ${label} must be 240 characters or fewer.`;
  }
  return "";
}

const PROPERTY_TYPES = [
  "Gated Apartment",
  "Independent House",
  "Independent Villa",
  "Shared Service Apartment",
  "Builder Floor",
];
const FURNISHED_OPTIONS = [
  "Fully furnished",
  "Semi-furnished",
  "Unfurnished",
];

export default function AddPropertyForm({
  requireAuth = true,
  requireAdmin = false,
}) {
  const fileInputRef = useRef(null);
  const { isAuthenticated, isAdmin, openAuth, ready, logout } = useAuth();
  const [values, setValues] = useState(initialState);
  const [photoFiles, setPhotoFiles] = useState([]);
  const [status, setStatus] = useState("idle");
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [createdId, setCreatedId] = useState(null);
  const [successOpen, setSuccessOpen] = useState(false);
  const [compressing, setCompressing] = useState(false);

  useEffect(() => {
    return () => {
      photoFiles.forEach((item) => URL.revokeObjectURL(item.preview));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValues((prev) => {
      if (name === "floorPlan") {
        return { ...prev, floorPlan: value, beds: bedsFromFloorPlan(value) };
      }
      if (type === "checkbox") {
        return { ...prev, [name]: checked };
      }
      return { ...prev, [name]: value };
    });
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const toggleAmenity = (key) => {
    setValues((prev) => {
      const has = prev.amenities.includes(key);
      return {
        ...prev,
        amenities: has
          ? prev.amenities.filter((k) => k !== key)
          : [...prev.amenities, key],
      };
    });
  };

  const handlePhotoSelect = async (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    if (!files.length) return;

    const remaining = MAX_PROPERTY_PHOTOS - photoFiles.length;
    if (remaining <= 0) {
      setErrors((prev) => ({
        ...prev,
        images: `You can upload up to ${MAX_PROPERTY_PHOTOS} photos.`,
      }));
      return;
    }

    const candidates = [];
    let rejection = "";
    for (const file of files) {
      if (candidates.length >= remaining) break;
      if (!ACCEPTED_PHOTO_TYPES.has(file.type)) {
        rejection = "Photos must be JPEG, PNG, or WebP.";
        continue;
      }
      if (file.size > MAX_PHOTO_BYTES) {
        rejection = "Each photo must be 5 MB or smaller before optimize.";
        continue;
      }
      candidates.push(file);
    }

    if (!candidates.length) {
      setErrors((prev) => ({
        ...prev,
        images: rejection || "Please choose valid photo files.",
      }));
      return;
    }

    setCompressing(true);
    try {
      const optimized = [];
      for (const file of candidates) {
        const compressed = await compressImageFile(file, {
          maxWidth: 1600,
          maxHeight: 1600,
          quality: 0.72,
        });
        optimized.push({
          file: compressed,
          preview: URL.createObjectURL(compressed),
          originalSize: file.size,
          optimizedSize: compressed.size,
        });
      }

      setPhotoFiles((prev) => [...prev, ...optimized]);
      setErrors((prev) => {
        const next = { ...prev };
        if (rejection) next.images = rejection;
        else delete next.images;
        return next;
      });
    } catch {
      setErrors((prev) => ({
        ...prev,
        images: "Could not optimize one or more photos. Please try again.",
      }));
    } finally {
      setCompressing(false);
    }
  };

  const removePhoto = (index) => {
    setPhotoFiles((prev) => {
      const next = [...prev];
      const [removed] = next.splice(index, 1);
      if (removed?.preview) URL.revokeObjectURL(removed.preview);
      return next;
    });
  };

  const validate = () => {
    const next = {};
    if (!values.title.trim()) next.title = "Please enter a property title.";
    if (!values.location.trim()) next.location = "Please enter a location.";
    const lat = Number(values.lat);
    const lng = Number(values.lng);
    if (String(values.lat).trim() === "" || Number.isNaN(lat) || lat < -90 || lat > 90) {
      next.lat = "Enter a latitude between -90 and 90.";
    }
    if (String(values.lng).trim() === "" || Number.isNaN(lng) || lng < -180 || lng > 180) {
      next.lng = "Enter a longitude between -180 and 180.";
    }
    if (!values.price.trim() || !/\d/.test(values.price)) {
      next.price = "Please enter a monthly rent amount.";
    }
    if (!values.area.trim() || Number(values.area) <= 0) {
      next.area = "Please enter the area in sqft.";
    }
    if (!richTextToPlain(values.description)) {
      next.description = "Please add a short description.";
    } else if (richTextToPlain(values.description).length > 5000) {
      next.description = "Description is too long (max 5000 characters).";
    }
    if (!values.availableFrom) {
      next.availableFrom = "Please select an available-from date.";
    } else if (values.availableFrom < todayIsoDate()) {
      next.availableFrom = "Available from must be today or a future date.";
    }
    if (
      values.onboardingCharge.trim() === "" ||
      Number(values.onboardingCharge) < 0 ||
      Number.isNaN(Number(values.onboardingCharge))
    ) {
      next.onboardingCharge = "Please enter a valid onboarding charge.";
    }
    if (photoFiles.length === 0) {
      next.images = "Please upload at least one photo from your gallery.";
    }
    const longHighlight = String(values.highlights || "")
      .split("\n")
      .map((line) => line.trim())
      .find((line) => line.length > 240);
    if (longHighlight) {
      next.highlights =
        "Each highlight must be 240 characters or fewer (one per line).";
    }
    const rentError = itemListError(values.rentExcludes, "Rent excludes");
    const managesError = itemListError(values.liveasyManages, "LivEasy Homes Manages");
    const ownerError = itemListError(
      values.ownerResponsibilities,
      "Owner is directly responsible for"
    );
    if (rentError) next.rentExcludes = rentError;
    if (managesError) next.liveasyManages = managesError;
    if (ownerError) next.ownerResponsibilities = ownerError;
    if (richTextToPlain(values.termsAndConditions).length > 5000) {
      next.termsAndConditions =
        "Terms and conditions must be 5000 characters or fewer.";
    }
    return next;
  };

  const mapApiError = (error) => {
    if (!(error instanceof ApiError)) {
      return error?.message || "Could not save this property. Please try again.";
    }

    if (error.status === 401) {
      logout();
      openAuth("login");
      return "Please log in again to publish a listing.";
    }

    if (error.status === 403) {
      return "This account cannot publish listings.";
    }

    if (error.fields) {
      const fieldErrors = {};
      Object.entries(error.fields).forEach(([key, message]) => {
        if (key === "photos") {
          fieldErrors.images = message;
          return;
        }
        // API returns indexed keys like highlights[0]
        const base = key.replace(/\[\d+]$/, "");
        if (!fieldErrors[base]) fieldErrors[base] = message;
      });
      setErrors((prev) => ({ ...prev, ...fieldErrors }));
    }

    return (
      error.message || "Could not save this property. Please try again."
    );
  };

  const resetForm = () => {
    photoFiles.forEach((item) => URL.revokeObjectURL(item.preview));
    setPhotoFiles([]);
    setValues(initialState);
    setErrors({});
    setFormError("");
    setCreatedId(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  useEffect(() => {
    if (!successOpen) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") setSuccessOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [successOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSuccessOpen(false);

    if (requireAuth && !isAuthenticated) {
      openAuth("login");
      setFormError("Please log in to add a property.");
      return;
    }

    if (requireAdmin && !isAdmin) {
      setFormError("Only admin accounts can publish from this page.");
      return;
    }

    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setStatus("submitting");
    let propertyId = createdId;
    let listingCreated = Boolean(createdId);

    try {
      if (!propertyId) {
        const created = await createProperty(buildPropertyPayload(values));
        propertyId = created.id;
        listingCreated = true;
        setCreatedId(propertyId);
      }

      setUploading(true);
      await uploadPropertyPhotos(
        propertyId,
        photoFiles.map((item) => item.file)
      );

      resetForm();
      setStatus("idle");
      setSuccessOpen(true);
    } catch (error) {
      setStatus("idle");
      const message = mapApiError(error);

      if (listingCreated && propertyId) {
        setCreatedId(propertyId);
        setErrors((prev) => ({
          ...prev,
          images: prev.images || message,
        }));
        setFormError(
          `Listing was saved as “${propertyId}”, but photos failed to upload. Fix the photos and submit again — a second listing will not be created.`
        );
      } else {
        setFormError(message);
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <section
      className="rounded-3xl bg-white p-6 sm:p-8 md:p-10 shadow-xl ring-1 ring-[#EFE7DF]"
      aria-labelledby="add-property-heading"
    >
      <span className="uppercase text-xs tracking-[0.25em] text-[#B08B6D] font-semibold">
        List a Home
      </span>
      <h1
        id="add-property-heading"
        className="mt-3 text-2xl sm:text-3xl font-serif text-[#2B2118] leading-snug"
      >
        Add a property
      </h1>
      <p className="mt-3 text-gray-600 leading-relaxed max-w-2xl">
        Fill in the details below. Listings are saved to the LiveEasy API and
        appear under New arrivals for all visitors.
      </p>

      {successOpen && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center p-4"
          role="presentation"
          onClick={() => setSuccessOpen(false)}
        >
          <div
            className="absolute inset-0 bg-[#2B2118]/50 backdrop-blur-sm"
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="property-listed-title"
            className="relative w-full max-w-md overflow-hidden rounded-[28px] bg-[#FAF8F5] p-8 shadow-2xl ring-1 ring-[#EFE7DF] text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSuccessOpen(false)}
              className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-[#2B2118] hover:bg-white transition"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#B08B6D]/15">
              <CheckCircle2
                className="h-8 w-8 text-[#8A6A55]"
                strokeWidth={1.75}
                aria-hidden="true"
              />
            </span>
            <h2
              id="property-listed-title"
              className="mt-5 text-2xl font-serif text-[#2B2118]"
            >
              Property listed successfully
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Your listing is live. The form is cleared so you can add another.
            </p>
            <button
              type="button"
              onClick={() => setSuccessOpen(false)}
              className="mt-6 inline-flex min-h-[48px] w-full items-center justify-center rounded-full bg-[#2B1D13] px-6 text-sm font-medium text-white hover:bg-[#3a2a1e] transition"
            >
              Add another property
            </button>
          </div>
        </div>
      )}

      {requireAuth && ready && !isAuthenticated && (
        <div className="mt-6 rounded-2xl border border-[#E0D6CC] bg-[#F7F3EE] p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-sm text-[#2B2118]">
            {requireAdmin
              ? "Admin login is required to publish a listing."
              : "Login is required to publish a listing."}
          </p>
          <button
            type="button"
            onClick={() => openAuth("login")}
            className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-[#2B1D13] px-5 text-sm font-medium text-white"
          >
            Log in
          </button>
        </div>
      )}

      {requireAdmin && ready && isAuthenticated && !isAdmin && (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          This account is not an admin. Switch to an ADMIN user to continue.
        </div>
      )}

      {createdId && !successOpen && (
        <p className="mt-6 text-sm text-[#8A6A55]" role="status">
          Listing “{createdId}” was created. Upload photos to finish — submitting
          again will only retry the photo step.
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        noValidate
        className="mt-8 space-y-8"
        aria-label="Add property form"
      >
        <fieldset className="space-y-5">
          <legend className="text-sm font-semibold uppercase tracking-[0.15em] text-[#8A6A55]">
            Basics
          </legend>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label htmlFor="prop-title" className={labelClass}>
                Property title
              </label>
              <input
                id="prop-title"
                name="title"
                type="text"
                value={values.title}
                onChange={handleChange}
                className={inputBase}
                placeholder="Maple Heights"
              />
              {errors.title && (
                <p className="mt-1.5 text-xs text-red-600">{errors.title}</p>
              )}
            </div>

            <div>
              <label htmlFor="prop-location" className={labelClass}>
                Location
              </label>
              <input
                id="prop-location"
                name="location"
                type="text"
                value={values.location}
                onChange={handleChange}
                className={inputBase}
                placeholder="Indiranagar, Bangalore"
              />
              {errors.location && (
                <p className="mt-1.5 text-xs text-red-600">{errors.location}</p>
              )}
            </div>

            <div>
              <label htmlFor="prop-price" className={labelClass}>
                Monthly rent (₹)
              </label>
              <input
                id="prop-price"
                name="price"
                type="text"
                inputMode="numeric"
                value={values.price}
                onChange={handleChange}
                className={inputBase}
                placeholder="48000"
              />
              {errors.price && (
                <p className="mt-1.5 text-xs text-red-600">{errors.price}</p>
              )}
            </div>

            <div>
              <label htmlFor="prop-lat" className={labelClass}>
                Latitude
              </label>
              <input
                id="prop-lat"
                name="lat"
                type="number"
                inputMode="decimal"
                step="any"
                value={values.lat}
                onChange={handleChange}
                className={inputBase}
                placeholder="28.4089"
              />
              {errors.lat && (
                <p className="mt-1.5 text-xs text-red-600">{errors.lat}</p>
              )}
            </div>

            <div>
              <label htmlFor="prop-lng" className={labelClass}>
                Longitude
              </label>
              <input
                id="prop-lng"
                name="lng"
                type="number"
                inputMode="decimal"
                step="any"
                value={values.lng}
                onChange={handleChange}
                className={inputBase}
                placeholder="77.3178"
              />
              {errors.lng && (
                <p className="mt-1.5 text-xs text-red-600">{errors.lng}</p>
              )}
            </div>

            <div>
              <label htmlFor="prop-floor-plan" className={labelClass}>
                Floor plan
              </label>
              <select
                id="prop-floor-plan"
                name="floorPlan"
                value={values.floorPlan}
                onChange={handleChange}
                className={inputBase}
              >
                {FLOOR_PLANS.map((plan) => (
                  <option key={plan} value={plan}>
                    {plan}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="prop-baths" className={labelClass}>
                Bathrooms
              </label>
              <input
                id="prop-baths"
                name="baths"
                type="number"
                min="0"
                value={values.baths}
                onChange={handleChange}
                className={inputBase}
              />
            </div>

            <div>
              <label htmlFor="prop-area" className={labelClass}>
                Area (sqft)
              </label>
              <input
                id="prop-area"
                name="area"
                type="number"
                min="1"
                value={values.area}
                onChange={handleChange}
                className={inputBase}
                placeholder="1200"
              />
              {errors.area && (
                <p className="mt-1.5 text-xs text-red-600">{errors.area}</p>
              )}
            </div>

            <div>
              <label htmlFor="prop-type" className={labelClass}>
                Property type
              </label>
              <select
                id="prop-type"
                name="propertyType"
                value={values.propertyType}
                onChange={handleChange}
                className={inputBase}
              >
                {PROPERTY_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="prop-furnished" className={labelClass}>
                Furnishing
              </label>
              <select
                id="prop-furnished"
                name="furnished"
                value={values.furnished}
                onChange={handleChange}
                className={inputBase}
              >
                {FURNISHED_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="prop-available" className={labelClass}>
                Available from
              </label>
              <input
                id="prop-available"
                name="availableFrom"
                type="date"
                min={todayIsoDate()}
                value={values.availableFrom}
                onChange={handleChange}
                className={inputBase}
                aria-invalid={Boolean(errors.availableFrom)}
              />
              {errors.availableFrom && (
                <p className="mt-1.5 text-xs text-red-600">
                  {errors.availableFrom}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="prop-onboarding" className={labelClass}>
                Onboarding charge (₹)
              </label>
              <input
                id="prop-onboarding"
                name="onboardingCharge"
                type="number"
                min="0"
                step="1"
                inputMode="numeric"
                value={values.onboardingCharge}
                onChange={handleChange}
                className={inputBase}
                placeholder="5000"
                aria-invalid={Boolean(errors.onboardingCharge)}
              />
              {errors.onboardingCharge && (
                <p className="mt-1.5 text-xs text-red-600">
                  {errors.onboardingCharge}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="prop-deposit" className={labelClass}>
                Deposit
              </label>
              <input
                id="prop-deposit"
                name="deposit"
                type="text"
                value={values.deposit}
                onChange={handleChange}
                className={inputBase}
              />
            </div>

            <div>
              <label htmlFor="prop-maintenance" className={labelClass}>
                Maintenance
              </label>
              <input
                id="prop-maintenance"
                name="maintenance"
                type="text"
                value={values.maintenance}
                onChange={handleChange}
                className={inputBase}
              />
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="prop-is-active"
                className="flex items-center gap-3 rounded-xl border border-[#E0D6CC] bg-[#FAF8F5] px-4 py-3 cursor-pointer"
              >
                <input
                  id="prop-is-active"
                  name="isActive"
                  type="checkbox"
                  checked={values.isActive}
                  onChange={handleChange}
                  className="h-4 w-4 accent-[#8A6A55]"
                />
                <span className="text-sm text-[#2B2118]">
                  Listing is active
                  <span className="block text-xs text-gray-500 font-normal mt-0.5">
                    Turn off to save as inactive. Defaults to active when on.
                  </span>
                </span>
              </label>
            </div>
          </div>
        </fieldset>

        <fieldset className="space-y-5">
          <legend className="text-sm font-semibold uppercase tracking-[0.15em] text-[#8A6A55]">
            Description
          </legend>
          <div>
            <label htmlFor="prop-description" className={labelClass}>
              About this home{" "}
              <span className="text-gray-400 font-normal">
                (formatting is kept on the listing page)
              </span>
            </label>
            <RichTextEditor
              id="prop-description"
              value={values.description}
              onChange={(html) => {
                setValues((prev) => ({
                  ...prev,
                  description: sanitizeRichText(html),
                }));
                if (errors.description) {
                  setErrors((prev) => {
                    const next = { ...prev };
                    delete next.description;
                    return next;
                  });
                }
              }}
              placeholder="Describe the home, neighbourhood, and what makes it special…"
              aria-invalid={Boolean(errors.description)}
            />
            {errors.description && (
              <p className="mt-1.5 text-xs text-red-600">{errors.description}</p>
            )}
          </div>
          <div>
            <label htmlFor="prop-highlights" className={labelClass}>
              Highlights{" "}
              <span className="text-gray-400 font-normal">
                (one per line, max 240 chars each, optional)
              </span>
            </label>
            <textarea
              id="prop-highlights"
              name="highlights"
              rows={4}
              value={values.highlights}
              onChange={handleChange}
              className={`${inputBase} min-h-[120px] resize-y`}
              placeholder={
                "Corner unit with cross ventilation\nPremium modular kitchen"
              }
              aria-invalid={Boolean(errors.highlights)}
            />
            {errors.highlights && (
              <p className="mt-1.5 text-xs text-red-600">{errors.highlights}</p>
            )}
          </div>
          <DynamicItemList
            id="prop-rent-excludes"
            label="Rent excludes"
            hint="(optional)"
            items={values.rentExcludes}
            placeholder="Electricity"
            error={errors.rentExcludes}
            onChange={(rentExcludes) =>
              setValues((prev) => ({
                ...prev,
                rentExcludes: rentExcludes.length ? rentExcludes : [""],
              }))
            }
          />
          <DynamicItemList
            id="prop-liveasy-manages"
            label="LivEasy Homes Manages"
            hint="(optional)"
            items={values.liveasyManages}
            placeholder="Tenant onboarding"
            error={errors.liveasyManages}
            onChange={(liveasyManages) =>
              setValues((prev) => ({
                ...prev,
                liveasyManages: liveasyManages.length ? liveasyManages : [""],
              }))
            }
          />
          <DynamicItemList
            id="prop-owner-responsibilities"
            label="Owner is directly responsible for"
            hint="(optional)"
            items={values.ownerResponsibilities}
            placeholder="Major repairs"
            error={errors.ownerResponsibilities}
            onChange={(ownerResponsibilities) =>
              setValues((prev) => ({
                ...prev,
                ownerResponsibilities: ownerResponsibilities.length
                  ? ownerResponsibilities
                  : [""],
              }))
            }
          />
          <div>
            <label htmlFor="prop-terms" className={labelClass}>
              Terms & Conditions{" "}
              <span className="text-gray-400 font-normal">
                (formatting is kept on the listing page, optional)
              </span>
            </label>
            <RichTextEditor
              id="prop-terms"
              value={values.termsAndConditions}
              onChange={(html) => {
                setValues((prev) => ({
                  ...prev,
                  termsAndConditions: sanitizeRichText(html),
                }));
                if (errors.termsAndConditions) {
                  setErrors((prev) => {
                    const next = { ...prev };
                    delete next.termsAndConditions;
                    return next;
                  });
                }
              }}
              placeholder="Rent is due on the 5th of each month."
              aria-invalid={Boolean(errors.termsAndConditions)}
            />
            {errors.termsAndConditions && (
              <p className="mt-1.5 text-xs text-red-600">
                {errors.termsAndConditions}
              </p>
            )}
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-sm font-semibold uppercase tracking-[0.15em] text-[#8A6A55] mb-4">
            Amenities
          </legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {AMENITY_OPTIONS.map((amenity) => {
              const checked = values.amenities.includes(amenity.key);
              return (
                <label
                  key={amenity.key}
                  className={`flex items-center gap-3 rounded-xl border px-4 py-3 cursor-pointer transition ${
                    checked
                      ? "border-[#B08B6D] bg-[#F7F3EE]"
                      : "border-[#E0D6CC] bg-white hover:bg-[#FAF8F5]"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleAmenity(amenity.key)}
                    className="h-4 w-4 accent-[#8A6A55]"
                  />
                  <span className="text-sm text-[#2B2118]">{amenity.label}</span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-sm font-semibold uppercase tracking-[0.15em] text-[#8A6A55] mb-4">
            Photos
          </legend>
          <p className="text-sm text-gray-600 mb-4">
            Upload photos from your gallery (up to {MAX_PROPERTY_PHOTOS}).
            Images are resized and compressed before upload to save server space.
          </p>

          <input
            ref={fileInputRef}
            id="prop-photos"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="sr-only"
            onChange={handlePhotoSelect}
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={
              uploading ||
              compressing ||
              photoFiles.length >= MAX_PROPERTY_PHOTOS
            }
            className="inline-flex min-h-[48px] w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-dashed border-[#B08B6D] bg-[#F7F3EE] px-6 py-3 text-sm font-medium text-[#2B2118] hover:bg-[#EFE7DF] transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {compressing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Optimizing photos…
              </>
            ) : (
              <>
                <ImagePlus className="h-4 w-4" aria-hidden="true" />
                Choose from gallery
              </>
            )}
          </button>

          {photoFiles.length > 0 && (
            <ul className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {photoFiles.map((item, index) => (
                <li
                  key={item.preview}
                  className="relative aspect-[4/3] overflow-hidden rounded-xl border border-[#E0D6CC] bg-[#FAF8F5]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.preview}
                    alt={`Selected photo ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#2B2118]/75 text-white hover:bg-[#2B2118] transition"
                    aria-label={`Remove photo ${index + 1}`}
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          )}

          {errors.images && (
            <p className="mt-2 text-xs text-red-600">{errors.images}</p>
          )}
        </fieldset>

        {formError && (
          <p className="text-sm text-red-600" role="alert">
            {formError}
          </p>
        )}

        <button
          type="submit"
          disabled={status === "submitting" || uploading || compressing}
          className="group inline-flex w-full min-h-[52px] items-center justify-center gap-2 rounded-full bg-[#2B1D13] px-6 py-3 text-white font-medium transition-all duration-300 hover:bg-[#3a2a1e] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {status === "submitting" || uploading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
              {uploading
                ? "Uploading photos…"
                : createdId
                  ? "Retrying photos…"
                  : "Saving…"}
            </>
          ) : (
            <>
              <Plus className="h-5 w-5" aria-hidden="true" />
              {createdId ? "Retry photo upload" : "Add property"}
            </>
          )}
        </button>
      </form>
    </section>
  );
}
