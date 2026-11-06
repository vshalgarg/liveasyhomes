import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Linkedin } from "lucide-react";
import AnimateIn from "../AnimateIn";

const details = [
  {
    icon: MapPin,
    label: "Address",
    value: "Plot No. 38, Shop No. 3, Veer Savarkar Block, Shakarpur, Delhi – 110092",
    href: null,
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+91 9953725343",
    href: "tel:+919953725343",
  },
  {
    icon: Mail,
    label: "Email",
    value: "info@liveasyhomes.in",
    href: "mailto:info@liveasyhomes.in",
  },
  {
    icon: Clock,
    label: "Working Hours",
    value: "Mon – Sun: 9:00 AM – 7:00 PM",
    href: null,
  },
];

const socials = [
  { icon: Facebook, label: "Facebook", href: "https://facebook.com" },
  { icon: Instagram, label: "Instagram", href: "https://instagram.com" },
  { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com" },
];

export default function ContactInfo() {
  return (
    <AnimateIn animation="fade-right" duration={750}>
      <aside
        className="relative h-full overflow-hidden rounded-3xl bg-gradient-to-br from-[#2B1D13] via-[#3A2A1E] to-[#5A4334] p-8 sm:p-10 text-white shadow-xl"
        aria-labelledby="contact-info-heading"
      >
        <div
          className="pointer-events-none absolute -top-24 -right-20 h-64 w-64 rounded-full bg-[#B08B6D]/30 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-[#8A6A55]/25 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative">
          <span className="uppercase text-xs tracking-[0.25em] text-[#E8C9A8] font-semibold">
            Reach Out
          </span>

          <h2
            id="contact-info-heading"
            className="mt-3 text-2xl sm:text-3xl font-serif text-white leading-snug"
          >
            Contact Information
          </h2>

          <p className="mt-4 text-white/75 leading-relaxed max-w-md">
            Get in touch with our team — we&apos;re happy to assist with home
            viewings, rental enquiries, or anything else.
          </p>

          <ul className="mt-10 space-y-7">
            {details.map(({ icon: Icon, label, value, href }) => (
              <li key={label} className="flex items-start gap-4">
                <span
                  className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15"
                  aria-hidden="true"
                >
                  <Icon className="h-5 w-5 text-[#E8C9A8]" strokeWidth={1.75} />
                </span>
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/60 font-medium">
                    {label}
                  </p>
                  {href ? (
                    <a
                      href={href}
                      className="mt-1 inline-block text-base sm:text-lg text-white hover:text-[#E8C9A8] transition break-words"
                    >
                      {value}
                    </a>
                  ) : (
                    <p className="mt-1 text-base sm:text-lg text-white break-words">
                      {value}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-12 pt-8 border-t border-white/15">
            <p className="uppercase text-xs tracking-[0.25em] text-[#E8C9A8] font-semibold">
              Follow Us
            </p>

            <ul className="mt-5 flex items-center gap-3">
              {socials.map(({ icon: Icon, label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15 text-white hover:bg-[#B08B6D] hover:ring-[#B08B6D] transition"
                  >
                    <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>
    </AnimateIn>
  );
}
