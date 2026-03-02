// src/components/sections/AboutSection/AboutSection.tsx
// ─────────────────────────────────────────────────────────
// About Us section: mission statement, vision, stats row,
// and three core value cards.
// Data from: src/lib/constants/site.data.ts → ABOUT
// ─────────────────────────────────────────────────────────

import { Target, Eye } from "lucide-react";
import { ABOUT } from "@/lib/constants/site.data";

export default function AboutSection() {
  return (
    <section id="about" className="space-y-12">

      {/* ── Header ── */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="inline-block font-extrabold tracking-widest text-blue-600 uppercase bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
          About Us
        </span>
        <h2 className="text-3xl font-black text-gray-900 leading-tight">
          {ABOUT.tagline}
        </h2>
      </div>

      {/* ── Mission + Vision ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* Mission */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
              <Target size={16} className="text-blue-600" />
            </div>
            <h3 className="font-bold text-gray-900 text-[15px]">Our Mission</h3>
          </div>
          <p className="text-[13.5px] text-gray-500 leading-relaxed">{ABOUT.mission}</p>
        </div>

        {/* Vision */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 space-y-3 relative overflow-hidden">
          {/* Decorative */}
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10 pointer-events-none" />
          <div className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full bg-white/10 pointer-events-none" />
          <div className="flex items-center gap-2 relative z-10">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
              <Eye size={16} className="text-white" />
            </div>
            <h3 className="font-bold text-white text-[15px]">Our Vision</h3>
          </div>
          <p className="text-[13.5px] text-blue-100 leading-relaxed relative z-10">{ABOUT.vision}</p>
        </div>
      </div>

      {/* ── Stats row ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {ABOUT.stats.map(({ value, label }) => (
          <div
            key={label}
            className="bg-white rounded-2xl border border-gray-100 p-5 text-center hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          >
            <p className="text-2xl font-black text-blue-600">{value}</p>
            <p className="text-xs text-gray-500 mt-1 font-medium">{label}</p>
          </div>
        ))}
      </div>

      {/* ── Core values ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {ABOUT.values.map(({ emoji, title, desc }) => (
          <div
            key={title}
            className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 space-y-2"
          >
            <span className="text-3xl">{emoji}</span>
            <p className="font-bold text-gray-900 text-[15px]">{title}</p>
            <p className="text-[13px] text-gray-500 leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

    </section>
  );
}