"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/home", label: "Home" },
  { href: "/listings", label: "Properties" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

function linkClass(isActive) {
  return `inline-flex min-h-[44px] items-center ${
    isActive
      ? "text-[#2B2118] font-medium"
      : "text-gray-600 hover:text-[#2B2118] transition"
  }`;
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path) =>
    path === "/home"
      ? pathname === "/home" || pathname === "/"
      : pathname.startsWith(path);

  const handleClose = () => setMenuOpen(false);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 bg-[#F8F5F1]/95 backdrop-blur border-b border-[#E8DFD6] pt-[env(safe-area-inset-top)]">
      <div className="container mx-auto px-4 lg:px-8 flex items-center justify-between h-16 lg:h-20">
        <Link href="/home" className="shrink-0" onClick={handleClose}>
          <Image
            src="/logo-bg.png"
            alt="LiveEasy Homes — verified rental homes in Bangalore"
            width={140}
            height={44}
            className="h-9 w-auto lg:h-11"
            priority
          />
        </Link>

        <nav
          className="hidden md:flex items-center gap-8"
          aria-label="Main navigation"
        >
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={linkClass(isActive(href))}
              aria-current={isActive(href) ? "page" : undefined}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <button
            type="button"
            className="min-h-[44px] px-5 py-2 text-sm font-medium text-[#2B2118] hover:bg-white/60 rounded-full transition"
          >
            Log In
          </button>
          <button
            type="button"
            className="min-h-[44px] px-5 py-2 text-sm font-medium bg-[#2B1D13] text-white rounded-full hover:bg-[#3a2a1e] transition"
          >
            Sign Up
          </button>
        </div>

        <button
          type="button"
          className="md:hidden flex items-center justify-center min-h-[44px] min-w-[44px] text-2xl leading-none text-[#2B2118]"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {menuOpen && (
        <nav
          id="mobile-navigation"
          className="md:hidden border-t border-[#E8DFD6] bg-[#F8F5F1] px-4 py-4 flex flex-col gap-1 max-h-[calc(100dvh-4rem)] overflow-y-auto pb-[env(safe-area-inset-bottom)]"
          aria-label="Mobile navigation"
        >
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={handleClose}
              className={linkClass(isActive(href))}
              aria-current={isActive(href) ? "page" : undefined}
            >
              {label}
            </Link>
          ))}
          <div className="flex flex-col gap-2 pt-4 mt-2 border-t border-[#E8DFD6]">
            <button
              type="button"
              className="w-full min-h-[48px] text-sm font-medium border border-[#D7CEC7] rounded-full"
            >
              Log In
            </button>
            <button
              type="button"
              className="w-full min-h-[48px] text-sm font-medium bg-[#2B1D13] text-white rounded-full"
            >
              Sign Up
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}
