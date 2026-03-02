// src/components/layout/Footer/Footer.tsx
// ─────────────────────────────────────────────────────────
// Site-wide footer.
// Logo + tagline left, 3 link columns, social icons, copyright bar.
// Data from: src/lib/constants/site.data.ts → FOOTER
// ─────────────────────────────────────────────────────────

import Link from "next/link";
import { Zap, Linkedin, Twitter, Instagram, Github } from "lucide-react";
import { FOOTER } from "@/lib/constants/site.data";

// Map icon string → lucide component
const SOCIAL_ICONS: Record<string, React.ElementType> = {
  linkedin:  Linkedin,
  twitter:   Twitter,
  instagram: Instagram,
  github:    Github,
};

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400 mt-20">

      {/* ── Main footer body ── */}
      <div className="max-w-[1400px] mx-auto px-8 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">

          {/* ── Brand column (spans 2) ── */}
          <div className="md:col-span-2 space-y-4">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shadow-md">
                <Zap size={16} className="text-white fill-white" />
              </div>
              <span
                className="text-xl font-black tracking-tight text-white"
                style={{
                  background: "linear-gradient(135deg,#60a5fa,#818cf8)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                CareerUnlock
              </span>
            </div>

            {/* Tagline */}
            <p className="text-[13.5px] text-gray-500 leading-relaxed max-w-xs">
              {FOOTER.tagline}
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-2 pt-1">
              {FOOTER.socials.map(({ label, href, icon }) => {
                const Icon = SOCIAL_ICONS[icon] ?? Zap;
                return (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-9 h-9 rounded-xl bg-gray-800 hover:bg-blue-600 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-150"
                  >
                    <Icon size={15} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* ── Link columns ── */}
          {FOOTER.links.map(({ heading, items }) => (
            <div key={heading} className="space-y-4">
              <p className="text-[11px] font-bold tracking-widest text-gray-500 uppercase">
                {heading}
              </p>
              <ul className="space-y-2.5">
                {items.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-[13px] text-gray-500 hover:text-white transition-colors duration-150"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>
      </div>

      {/* ── Copyright bar ── */}
      <div className="border-t border-gray-800">
        <div className="max-w-[1400px] mx-auto px-8 py-4 flex items-center justify-between flex-wrap gap-3">
          <p className="text-[12px] text-gray-600">{FOOTER.copyright}</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-[12px] text-gray-600 hover:text-gray-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-[12px] text-gray-600 hover:text-gray-400 transition-colors">
              Terms of Use
            </Link>
          </div>
        </div>
      </div>

    </footer>
  );
}