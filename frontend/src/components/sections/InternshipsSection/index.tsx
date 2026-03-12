// src/components/sections/InternshipsSection/InternshipsSection.tsx
// Server Component — GET /api/internships/featured?limit=3
// Fields: title, organization, company, city, work_style, stipend, duration, is_verified, source

import Link from "next/link";
import { MapPin, IndianRupee, Clock, ArrowRight, BadgeCheck } from "lucide-react";
import SectionHeader from "@/components/common/SectionHeader";
import { getFeaturedInternships, type Internship } from "@/lib/api/opportunities";

// ── Logo helpers (no logo_color in DB — derived from index) ──
const LOGO_COLORS = [
  "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
  "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
  "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
  "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
];

function logoColor(i: number) {
  return LOGO_COLORS[i % LOGO_COLORS.length];
}

function initials(name: string) {
  return name.split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

// ── Display name: prefer company, fall back to organization ──
function displayName(item: Internship): string {
  return item.company || item.organization || "Unknown";
}

// ── Format stipend VARCHAR (e.g. "15000", "15000-20000", "Unpaid") ──
function formatStipend(stipend: string | null | undefined): string {
  if (!stipend) return "Unknown";
  const lower = stipend.toLowerCase();
  if (lower === "unpaid" || lower === "0") return "Unpaid";

  const parts = stipend.split(/[-–]/);

  if (parts.length === 2) {
    const a = parseInt(parts[0]);
    const b = parseInt(parts[1]);

    if (!isNaN(a) && !isNaN(b))
      return `${(a / 1000).toFixed(0)}K – ${(b / 1000).toFixed(0)}K/mo`;
  }

  const n = parseInt(stipend);
  if (!isNaN(n)) return `${(n / 1000).toFixed(0)}K/mo`;

  return stipend;
}

// ── Location label ────────────────────────────────────────
function locationLabel(item: Internship): string {
  if (item.city && item.work_style) return `${item.city} · ${item.work_style}`;
  return item.city || item.work_style || "Location not specified";
}

export default async function InternshipsSection() {
  let internships: Internship[] = [];

  try {
    internships = await getFeaturedInternships(3);
  } catch (err) {
    console.error("InternshipsSection fetch failed:", err);
  }

  return (
    <section id="internships">
      <SectionHeader
        title="Internships"
        subtitle="Unleash internships tailored to your aspirations."
        href="/internships"
        accentColor="bg-blue-500"
      />

      {internships.length === 0 ? (
        <p className="text-sm text-gray-400 dark:text-gray-500 py-6 text-center">
          No internships right now — check back soon!
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {internships.map((item, i) => (
            <a
              key={item.id}
              href={item.apply_url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 hover:shadow-md hover:border-blue-100 dark:hover:border-blue-900 transition-all duration-200 block group"
            >
              {/* Top: logo */}
              <div className="flex items-start justify-between mb-3">
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold ${logoColor(i)}`}
                >
                  {initials(displayName(item))}
                </div>

                {item.is_verified && (
                  <BadgeCheck size={14} className="text-blue-500 mt-0.5" />
                )}
              </div>

              {/* Title */}
              <p className="font-bold text-gray-900 dark:text-gray-100 text-[13.5px] leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                {item.title}
              </p>

              {/* Company */}
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 truncate">
                {displayName(item)}
              </p>

              {/* Location */}
              <div className="flex items-center gap-3 mt-3 text-xs text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1 capitalize">
                  <MapPin size={11} /> {locationLabel(item)}
                </span>
              </div>

              {/* Stipend + duration chips */}
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <span className="flex items-center gap-1 text-[10px] font-semibold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950 px-2 py-0.5 rounded-full">
                  <IndianRupee size={9} strokeWidth={2.5} />
                  {formatStipend(item.stipend)}
                </span>

                {item.duration && (
                  <span className="flex items-center gap-1 text-[10px] font-medium text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 px-2 py-0.5 rounded-full">
                    <Clock size={9} />
                    {item.duration}
                  </span>
                )}

                {item.source && item.source !== "manual" && (
                  <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500 border border-gray-100 dark:border-gray-800 px-2 py-0.5 rounded-full capitalize">
                    {item.source}
                  </span>
                )}
              </div>
            </a>
          ))}
        </div>
      )}

    </section>
  );
}