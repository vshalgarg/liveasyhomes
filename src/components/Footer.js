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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
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
        </div>

        <p className="border-t border-white/20 mt-12 md:mt-16 pt-8 text-center text-[#F9F7F4]/75 text-sm">
          © {new Date().getFullYear()} LiveEasy Homes. All rights reserved.
        </p>
      </div>
      </AnimateIn>
    </footer>
  );
}
