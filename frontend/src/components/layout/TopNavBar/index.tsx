"use client";

// src/components/layout/ScrollAwareTopBar.tsx
// ─────────────────────────────────────────────────────────
// Sits at the very top of the scrollable content column.
// NOT sticky — scrolls away as the user scrolls down.
// Logo left, Search button right. Search is UI-only (Phase 1).
// ─────────────────────────────────────────────────────────

import Image from "next/image";
import { Search } from "lucide-react";

export default function ScrollAwareTopBar() {
  return (
    <div className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-300 shadow-sm">

      {/* ── Logo ── */}
      <Image
        src="/images/logo.png"
        alt="Logo"
        width={150}
        height={40}
        priority
        className="h-10 w-auto object-contain"
      />

      {/* ── Search pill — UI only ── */}
      <button
        aria-label="Search"
        className="flex items-center gap-2.5 px-4 py-2.5 bg-gray-100 border border-gray-500 rounded-full text-gray-400 text-sm transition-all duration-200 hover:border-blue-400 hover:bg-white hover:shadow-[0_0_0_4px_#eff6ff] focus:outline-none focus:border-blue-400 focus:shadow-[0_0_0_4px_#eff6ff] min-w-60"
      >
        <Search size={16} strokeWidth={2} className="text-gray-400 shrink-0" />
        <span className="text-gray-400 text-[13px]">Search opportunities...</span>
      </button>

    </div>
  );
}