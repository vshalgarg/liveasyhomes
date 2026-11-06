"use client";

import Link from "next/link";
import AddPropertyForm from "@/components/listings/AddPropertyForm";
import { useAuth } from "@/components/auth/AuthProvider";

/** Only ADMIN accounts can use this page. API still enforces authorization. */
export default function AdminAddPropertyGate() {
  const { ready, isAuthenticated, isAdmin, openAuth, logout, user } = useAuth();

  if (!ready) {
    return (
      <div className="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-[#EFE7DF] text-sm text-gray-500">
        Checking admin access…
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-[#EFE7DF]">
        <h2 className="text-2xl font-serif text-[#2B2118]">Admin login required</h2>
        <p className="mt-2 text-gray-600">
          Sign in with an administrator account to publish listings.
        </p>
        <button
          type="button"
          onClick={() => openAuth("login")}
          className="mt-6 inline-flex min-h-[48px] items-center justify-center rounded-full bg-[#2B1D13] px-6 text-sm font-medium text-white hover:bg-[#3a2a1e] transition"
        >
          Log in as admin
        </button>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-[#EFE7DF]">
        <h2 className="text-2xl font-serif text-[#2B2118]">Access denied</h2>
        <p className="mt-2 text-gray-600">
          Signed in as {user?.email || "this account"}, but only{" "}
          <span className="font-medium text-[#2B2118]">ADMIN</span> users can
          add properties here.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => logout()}
            className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-[#2B1D13] px-6 text-sm font-medium text-white hover:bg-[#3a2a1e] transition"
          >
            Switch account
          </button>
          <Link
            href="/listings"
            className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-[#D7CEC7] px-6 text-sm font-medium text-[#2B2118] hover:bg-[#F8F5F1] transition"
          >
            Back to Properties
          </Link>
        </div>
      </div>
    );
  }

  return <AddPropertyForm requireAuth requireAdmin />;
}
