// src/components/common/SectionHeader/SectionHeader.tsx
// ─────────────────────────────────────────────────────────
// Reusable section header used in every home section.
// Blue left bar | Title + subtitle | View All button (right)
// ─────────────────────────────────────────────────────────

import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface SectionHeaderProps {
  title:        string;
  subtitle:     string;
  href:         string;
  accentColor?: string; // tailwind border color e.g. "border-blue-500"
}

export default function SectionHeader({
  title,
  subtitle,
  href,
  accentColor = "bg-blue-500",
}: SectionHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div className="flex gap-3">
        {/* Left accent bar */}
        <div className={`w-1 min-h-11 rounded-full ${accentColor} shrink-0`} />
        <div>
          <h2 className="text-xl font-bold text-gray-900 leading-tight">{title}</h2>
          <p className="text-sm text-gray-400 mt-0.5">{subtitle}</p>
        </div>
      </div>

      {/* View All pill */}
      <Link
        href={href}
        className="flex items-center gap-1 text-[13px] font-semibold text-blue-600 border border-blue-200 bg-blue-50 px-3.5 py-1.5 rounded-full hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-200 shrink-0 mt-1"
      >
        View All <ChevronRight size={13} />
      </Link>
    </div>
  );
}