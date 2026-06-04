import Link from "next/link";
import AnimateIn from "./AnimateIn";

const quickLinks = [
  { href: "/home", label: "Home" },
  { href: "/listings", label: "Properties" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="bg-[#8B7361] pt-16 pb-10 md:pt-20 text-[#F9F7F4]">
      <AnimateIn animation="fade-up" threshold={0.05}>
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="sm:col-span-2">
            <p className="text-2xl font-serif font-semibold text-white">
              LiveEasy Homes
            </p>

            <p className="text-[#F9F7F4]/90 mt-5 max-w-sm leading-relaxed">
              Helping you find peaceful living spaces with trusted management.
            </p>
          </div>

          <div>
            <h2 className="font-semibold mb-5 text-base text-white">Quick Links</h2>

            <ul className="space-y-3 text-[#F9F7F4]/85">
              {quickLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="hover:text-white transition">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-semibold mb-5 text-base text-white">Company</h2>

            <ul className="space-y-3 text-[#F9F7F4]/85">
              <li>
                <Link href="/privacy" className="hover:text-white transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition">
                  Terms &amp; Conditions
                </Link>
              </li>
            </ul>
          </div>

          <div className="sm:col-span-2 lg:col-span-1">
            <h2 className="font-semibold mb-5 text-base text-white">Newsletter</h2>

            <form
              className="flex flex-col sm:flex-row gap-2"
              action="#"
              aria-label="Newsletter signup"
            >
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                name="email"
                type="email"
                required
                placeholder="Enter your email"
                autoComplete="email"
                className="w-full min-h-[48px] rounded-xl sm:rounded-l-xl sm:rounded-r-none px-4 py-3 outline-none bg-white text-[#2B2118] placeholder:text-gray-400 border border-transparent focus:border-[#F9F7F4]"
              />

              <button
                type="submit"
                className="bg-[#2B1D13] text-white px-5 min-h-[48px] rounded-xl sm:rounded-l-none sm:rounded-r-xl hover:bg-[#3a2a1e] transition shrink-0"
                aria-label="Subscribe to newsletter"
              >
                →
              </button>
            </form>
          </div>
        </div>

        <p className="border-t border-white/20 mt-12 md:mt-16 pt-8 text-center text-[#F9F7F4]/75 text-sm">
          © {new Date().getFullYear()} LiveEasy Homes. All rights reserved.
        </p>
      </div>
      </AnimateIn>
    </footer>
  );
}
