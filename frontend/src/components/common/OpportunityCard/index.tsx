// src/components/common/OpportunityCard/OpportunityCard.tsx
// ─────────────────────────────────────────────────────────
// Reusable card for Internships and Jobs.
// - Whole card is NOT a link — only the CTA button navigates
// - Platform pill shows tooltip "Posted on X" on hover
// - Experience chip shows "Experience" label on hover
// ─────────────────────────────────────────────────────────
"use client";
import {
  MapPin, Clock, IndianRupee, Briefcase,
  CalendarDays, BadgeCheck, ShieldAlert,
} from "lucide-react";

const PLATFORMS = {
  linkedin: { label: "LinkedIn",    cls: "text-blue-600   bg-blue-50   border-blue-100",   url: "https://linkedin.com"  },
  naukri:   { label: "Naukri",      cls: "text-orange-600 bg-orange-50  border-orange-100", url: "https://naukri.com"    },
  careers:  { label: "Career Site", cls: "text-gray-600   bg-gray-100  border-gray-200",   url: "#"                     },
  unstop:   { label: "Unstop",      cls: "text-violet-600 bg-violet-50  border-violet-100", url: "https://unstop.com"    },
} as const;

export type Platform = keyof typeof PLATFORMS;

export interface OpportunityCardProps {
  type:        "internship" | "job";
  title:       string;
  company:     string;
  location:    string;
  logo:        string;
  logoColor:   string;
  postedOn:    Platform;
  verified:    boolean;
  postedAt:    string;
  applyUrl?:   string;
  // Internship
  stipend?:    string;
  duration?:   string;
  // Job
  salary?:     string;
  jobType?:    string;
  experience?: string;
}

export default function OpportunityCard(props: OpportunityCardProps) {
  const {
    type, title, company, location, logo, logoColor,
    postedOn, verified, postedAt, applyUrl,
    stipend, duration, salary, jobType, experience,
  } = props;

  const isInternship = type === "internship";
  const platform     = PLATFORMS[postedOn];

  const accent = isInternship
    ? { border: "hover:border-blue-200",   title: "group-hover:text-blue-600",   btn: "bg-blue-600 hover:bg-blue-700",     ring: "hover:shadow-blue-100"   }
    : { border: "hover:border-violet-200", title: "group-hover:text-violet-600", btn: "bg-violet-600 hover:bg-violet-700", ring: "hover:shadow-violet-100" };

  return (
    <div className={`
      bg-white rounded-2xl border border-gray-300 p-4 hover:shadow-lg ${accent.border} ${accent.ring} transition-all duration-200 group flex flex-col gap-3
    `}>

      {/* ── Row 1: Logo · Company · Verified · Platform ── */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className={`w-11 h-11 rounded-xl ${logoColor} flex items-center justify-center text-sm font-bold shrink-0`}>
            {logo}
          </div>
          <div className="min-w-0">
            <p className="text-[12.5px] font-semibold text-gray-800 truncate">{company}</p>
            <div className="flex items-center gap-1 mt-0.5">
              {verified ? (
                <>
                  <BadgeCheck size={11} className="text-emerald-500 shrink-0" />
                  <span className="text-[10px] text-emerald-600 font-semibold">Verified</span>
                </>
              ) : (
                <>
                  <ShieldAlert size={11} className="text-amber-400 shrink-0" />
                  <span className="text-[10px] text-amber-500 font-medium">Unverified</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Platform pill with tooltip */}
        <div className="relative group/platform shrink-0">
          <span className={`
            text-[10px] font-semibold px-2 py-0.5 rounded-full border cursor-default
            ${platform.cls}
          `}>
            {platform.label}
          </span>
          {/* Tooltip */}
          <div className="
            pointer-events-none absolute right-0 top-7
            opacity-0 group-hover/platform:opacity-100
            translate-y-1 group-hover/platform:translate-y-0
            transition-all duration-150 z-20
          ">
            <div className="bg-gray-900 text-white text-[10px] font-medium px-2.5 py-1.5 rounded-lg whitespace-nowrap shadow-lg">
              Posted on {platform.label}
            </div>
          </div>
        </div>
      </div>

      {/* ── Row 2: Title ── */}
      <p className={`font-bold text-gray-900 text-[14px] leading-snug ${accent.title} transition-colors cursor-default`}>
        {title}
      </p>

      {/* ── Row 3: Meta chips ── */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">

        <span className="flex items-center gap-1 text-[11px] text-gray-500">
          <MapPin size={11} className="shrink-0" />{location}
        </span>

        {isInternship && stipend && (
          <span className="flex items-center gap-0.5 text-[11px] font-semibold text-emerald-600">
            <IndianRupee size={10} />{stipend}
          </span>
        )}
        {isInternship && duration && (
          <span className="flex items-center gap-1 text-[11px] text-gray-500">
            <Clock size={11} />{duration}
          </span>
        )}

        {!isInternship && salary && (
          <span className="flex items-center gap-0.5 text-[11px] font-semibold text-emerald-600">
            <IndianRupee size={10} />{salary}
          </span>
        )}
        {!isInternship && jobType && (
          <span className="flex items-center gap-1 text-[11px] text-gray-500">
            <Briefcase size={11} />{jobType}
          </span>
        )}

        {/* Experience chip with hover tooltip */}
        {!isInternship && experience && (
          <div className="relative group/exp">
            <span className="flex items-center gap-1 text-[11px] text-gray-500 cursor-default">
              <Clock size={11} />{experience}
            </span>
            <div className="
              pointer-events-none absolute left-0 -top-7
              opacity-0 group-hover/exp:opacity-100
              translate-y-1 group-hover/exp:translate-y-0
              transition-all duration-150 z-20
            ">
              <div className="bg-gray-900 text-white text-[10px] font-medium px-2.5 py-1.5 rounded-lg whitespace-nowrap shadow-lg">
                Experience required
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Row 4: Footer — posted time + CTA link ── */}
      <div className="flex items-center justify-between pt-2.5 border-t border-gray-50 mt-auto">
        <span className="flex items-center gap-1 text-[11px] text-gray-400">
          <CalendarDays size={10} />{postedAt}
        </span>
        <a
          href={applyUrl ?? platform.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`text-[11px] font-bold px-3 py-1.5 rounded-lg text-white ${accent.btn} transition-colors`}
          onClick={(e) => e.stopPropagation()}
        >
          {isInternship ? "Apply Now" : "View Job"}
        </a>
      </div>

    </div>
  );
}