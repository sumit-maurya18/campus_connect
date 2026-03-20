"use client";

// src/components/sections/HackathonCollage/HackathonCollage.tsx
// ─────────────────────────────────────────────────────────
// Always shows exactly 4 cards on desktop.
// Uses index + CSS translateX — no scrollLeft, no guesswork.
// Auto-advances every 3s. Pauses on hover. Both arrows work.
// Dot indicators show current position.
// ─────────────────────────────────────────────────────────

import { useEffect, useRef, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { HACKATHON_BANNERS } from "@/lib/constants/home.data";

const AUTO_DELAY    = 3000;
const VISIBLE_COUNT = 4;
const GAP_PX        = 16; // Tailwind gap-4 = 16px

export default function HackathonCollage() {
  const [index, setIndex]         = useState(0);
  const intervalRef               = useRef<ReturnType<typeof setInterval> | null>(null);
  const total                     = HACKATHON_BANNERS.length;
  // How many positions we can scroll to
  const maxIndex                  = total - VISIBLE_COUNT;

  const prev = useCallback(() =>
    setIndex((i) => Math.max(i - 1, 0)), []);

  const next = useCallback(() =>
    setIndex((i) => (i >= maxIndex ? 0 : i + 1)), [maxIndex]);

  // ── Auto-scroll ───────────────────────────────────────
  const stopAuto = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startAuto = useCallback(() => {
    stopAuto();
    intervalRef.current = setInterval(next, AUTO_DELAY);
  }, [stopAuto, next]);

  useEffect(() => {
    startAuto();
    return stopAuto;
  }, [startAuto, stopAuto]);

  // ── Translate: each step = one card width + gap ───────
  // cardWidth = (container% - gaps) / 4  — done in CSS via calc
  // translateX offset = index * (25% of track + gap correction)
  // We express this as: index * calc(25% + GAP/4 * 3 / total * ...)
  // Simpler: use a wrapper trick — track width = total/4 * 100%
  // Each card = 100% / total of track = 25% of viewport visually
  const translatePct = -(index * (100 / VISIBLE_COUNT));

  return (
    <section>

      {/* ── Header row ── */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 rounded-full bg-blue-500 shrink-0" />
          <h2 className="text-xl font-bold text-gray-900">Featured</h2>
        </div>

        {/* Arrow buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => { stopAuto(); prev(); }}
            disabled={index === 0}
            aria-label="Previous"
            className="w-9 h-9 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-500 hover:text-blue-600 hover:border-blue-300 hover:shadow-md disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150"
          >
            <ChevronLeft size={18} strokeWidth={2.5} />
          </button>
          <button
            onClick={() => { stopAuto(); next(); }}
            disabled={index >= maxIndex}
            aria-label="Next"
            className="w-9 h-9 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-500 hover:text-blue-600 hover:border-blue-300 hover:shadow-md disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150"
          >
            <ChevronRight size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* ── Viewport: clips the track, shows exactly 4 cards ── */}
      <div
        className="overflow-hidden"
        onMouseEnter={stopAuto}
        onMouseLeave={startAuto}
      >
        {/*
          Track width = total cards * (1/4 of container).
          Each card = 1/4 of container - gap adjustments.
          translateX moves by exactly one card width per step.
        */}
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            // Track is wide enough to hold all cards at 1/4 viewport each
            width: `${(total / VISIBLE_COUNT) * 100}%`,
            transform: `translateX(${translatePct / (total / VISIBLE_COUNT)}%)`,
            gap: `${GAP_PX}px`,
          }}
        >
          {HACKATHON_BANNERS.map((banner, i) => {
            // Each card takes equal share of the track
            const cardWidthPct = 100 / total;
            return (
              <div
                key={i}
                className="shrink-0 cursor-pointer group"
                style={{ width: `calc(${cardWidthPct}% - ${GAP_PX * (total - 1) / total}px)` }}
              >
                {/* ── Tall banner ── */}
                <div
                  className={`
                    w-full h-70 rounded-2xl overflow-hidden
                    bg-linear-to-br ${banner.bg}
                    relative shadow-sm
                    group-hover:shadow-xl group-hover:-translate-y-1
                    transition-all duration-300
                  `}
                >
                  <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
                  <div className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full bg-white/5 pointer-events-none" />

                  {/* Tag */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full text-white ${banner.accent}`}>
                      {banner.tag}
                    </span>
                  </div>

                  {/* Bottom overlay */}
                  <div className="absolute bottom-0 left-0 right-0 px-3 py-3 bg-linear-to-t from-black/70 via-black/30 to-transparent">
                    <p className="text-white font-bold text-[13px] leading-snug">{banner.title}</p>
                    <p className="text-white/65 text-[11px] mt-0.5 truncate">{banner.org}</p>
                  </div>
                </div>

                {/* ── Below banner ── */}
                <div className="mt-2.5 px-0.5">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {banner.modeTags?.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-medium text-gray-500 border border-gray-200 px-2 py-0.5 rounded-full bg-white"
                        >
                          {tag}
                        </span>
                      ))}
                      {banner.ctaTag && (
                        <span className="text-[10px] font-semibold text-blue-600 border border-blue-200 bg-blue-50 px-2 py-0.5 rounded-full">
                          {banner.ctaTag}
                        </span>
                      )}
                    </div>
                    <button aria-label="Save" className="text-gray-300 hover:text-rose-400 transition-colors shrink-0 ml-1">
                      <Heart size={14} strokeWidth={1.8} />
                    </button>
                  </div>

                  <p className="text-[13px] font-bold text-gray-900 leading-snug line-clamp-2">
                    {banner.cardTitle ?? banner.title}
                  </p>
                  {banner.cardSubtitle && (
                    <p className="text-[11px] text-gray-400 mt-0.5 truncate">{banner.cardSubtitle}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Dot indicators ── */}
      <div className="flex items-center justify-center gap-1.5 mt-5">
        {Array.from({ length: maxIndex + 1 }).map((_, i) => (
          <button
            key={i}
            onClick={() => { stopAuto(); setIndex(i); }}
            aria-label={`Go to position ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${
              i === index
                ? "w-5 h-1.5 bg-blue-500"
                : "w-1.5 h-1.5 bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>

    </section>
  );
}