// src/components/sections/HeroSection/HeroSection.tsx
// ─────────────────────────────────────────────────────────
// Top of the home page.
// Contains: headline, subtext, category banners.
// Data comes from home.data.ts
// ─────────────────────────────────────────────────────────

import Link from "next/link";
import { HERO_BANNERS } from "@/lib/constants/home.data";

export default function HeroSection() {
  return (
    <section className="space-y-7">

      {/* ── Headline row ── */}
      <div>
        <h1 className="text-5xl font-black text-gray-900 leading-tight tracking-tight">
          Unlock Your{" "}
          <span
            style={{
              background: "linear-gradient(135deg,#2563eb,#7c3aed)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Career!
          </span>
        </h1>
        <p className="text-[17px] text-gray-600 mt-2 leading-relaxed">
          Find internships, jobs, hackathons &amp; events tailored for you.
        </p>
      </div>

      {/* ── Category banner tiles ── */}
      <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(150px,1fr))]">
        {HERO_BANNERS.map(({ label, href, emoji, bg }) => (
          <Link
            key={label}
            href={href}
            className={`
              min-w-37.5 h-30 rounded-2xl
              flex flex-col items-center justify-center gap-3
              font-semibold text-gray-800
              border border-gray-300
              shadow-sm hover:shadow-md hover:-translate-y-0.5
              transition-all duration-200
              ${bg}
            `}
          >
            <span className="text-4xl">{emoji}</span>
            <span className="text-sm font-bold">{label}</span>
          </Link>
        ))}
      </div>

    </section>
  );
}