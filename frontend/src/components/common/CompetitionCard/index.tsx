"use client";

import {
  Trophy, Users, Clock, MapPin,
  CalendarDays, BadgeCheck, ShieldAlert,
  Tag, UsersRound, ExternalLink,
} from "lucide-react";

const PLATFORMS = {
  linkedin: { label: "LinkedIn", cls: "text-blue-600 bg-blue-50 border-blue-100", url: "https://linkedin.com" },
  naukri: { label: "Naukri", cls: "text-orange-600 bg-orange-50 border-orange-100", url: "https://naukri.com" },
  careers: { label: "Career Site", cls: "text-gray-600 bg-gray-100 border-gray-200", url: "#" },
  unstop: { label: "Unstop", cls: "text-violet-600 bg-violet-50 border-violet-100", url: "https://unstop.com" },
} as const;

export type Platform = keyof typeof PLATFORMS;

const TAG_STYLES: Record<string, string> = {
  Open: "bg-emerald-50 text-emerald-600 border-emerald-200",
  Registering: "bg-orange-50 text-orange-500 border-orange-200",
  "Closing Soon": "bg-red-50 text-red-500 border-red-200",
  Free: "bg-emerald-50 text-emerald-600 border-emerald-200",
  Paid: "bg-rose-50 text-rose-500 border-rose-200",
};

const BANNER_GRADIENTS: Record<string, string> = {
  hackathon: "from-orange-500 via-orange-600 to-rose-600",
  event: "from-emerald-500 via-teal-600 to-cyan-700",
};

export interface CompetitionCardProps {
  type: "hackathon" | "event";
  title: string;
  org: string;
  tag: string;
  postedOn: Platform;
  verified: boolean;
  postedAt: string;
  categories: string[];
  applyUrl?: string;

  prize?: string;
  deadline?: string;
  participants?: string;
  teamSize?: string;

  date?: string;
  mode?: string;
  seats?: string;
}

export default function CompetitionCard(props: CompetitionCardProps) {
  const {
    type, title, org, tag, postedOn, verified, postedAt,
    categories, applyUrl,
    prize, deadline, participants, teamSize,
    date, mode, seats,
  } = props;

  const isHackathon = type === "hackathon";
  const platform = PLATFORMS[postedOn];
  const tagStyle = TAG_STYLES[tag] ?? "bg-gray-50 text-gray-500 border-gray-200";
  const bannerGrad = BANNER_GRADIENTS[type];

  const accent = isHackathon
    ? { border: "hover:border-orange-200", btn: "bg-orange-500 hover:bg-orange-600" }
    : { border: "hover:border-emerald-200", btn: "bg-emerald-600 hover:bg-emerald-700" };

  return (
    <div className={`bg-white rounded-2xl border border-gray-300 overflow-hidden hover:shadow-xl ${accent.border} transition-all duration-200 flex flex-row min-h-52.5`}>

      {/* LEFT BANNER */}
      <div className={`w-[36%] shrink-0 bg-linear-to-br ${bannerGrad} relative overflow-hidden flex flex-col justify-between p-3`}>
        <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute -bottom-4 -left-4 w-14 h-14 rounded-full bg-white/10 pointer-events-none" />

        <span className={`self-start text-[9px] font-bold px-2 py-0.5 rounded-full border ${tagStyle} z-10`}>
          {tag}
        </span>

        <div className="z-10 space-y-1">
          {isHackathon && prize && (
            <div className="flex items-center gap-1">
              <Trophy size={18} className="text-white/90 shrink-0" />
              <span className="text-white font-black text-[12px] leading-tight">{prize}</span>
            </div>
          )}

          {!isHackathon && seats && (
            <div className="flex items-center gap-1">
              <UsersRound size={16} className="text-white/90 shrink-0" />
              <span className="text-white font-black text-[12px] leading-tight">{seats} seats</span>
            </div>
          )}

          <p className="text-white/65 text-[9.5px] leading-snug line-clamp-2">{org}</p>
        </div>
      </div>

      {/* RIGHT CONTENT */}
      <div className="flex-1 flex flex-col gap-1.5 p-3.5 min-w-0 overflow-hidden">

        {/* Platform + verified */}
        <div className="flex items-center justify-between gap-1">
          <div className="relative group/platform">
            <span className={`text-[9.5px] font-semibold px-2 py-0.5 rounded-full border cursor-default ${platform.cls}`}>
              {platform.label}
            </span>

            <div className="pointer-events-none absolute left-0 top-6 opacity-0 group-hover/platform:opacity-100 translate-y-1 group-hover/platform:translate-y-0 transition-all duration-150 z-30">
              <div className="bg-gray-900 text-white text-[10px] px-2.5 py-1.5 rounded-lg whitespace-nowrap shadow-xl">
                Posted on {platform.label}
              </div>
            </div>
          </div>

          {verified ? (
            <span className="flex items-center gap-0.5 text-[9.5px] text-emerald-600 font-semibold">
              <BadgeCheck size={10} /> Verified
            </span>
          ) : (
            <span className="flex items-center gap-0.5 text-[9.5px] text-amber-500 font-medium">
              <ShieldAlert size={10} /> Unverified
            </span>
          )}
        </div>

        {/* Title */}
        <p className="font-bold text-gray-900 text-[13.5px] leading-snug">{title}</p>

        {/* Stats */}
        <div className="flex flex-col gap-0.5">
          {isHackathon && participants && (
            <span className="flex items-center gap-1 text-[10.5px] text-gray-500">
              <Users size={10} /> {participants} participants
            </span>
          )}

          {isHackathon && deadline && (
            <span className="flex items-center gap-1 text-[10.5px] text-gray-500">
              <Clock size={10} /> Last date: <span className="font-semibold text-gray-700 ml-0.5">{deadline}</span>
            </span>
          )}

          {isHackathon && teamSize && (
            <span className="flex items-center gap-1 text-[10.5px] text-gray-500">
              <UsersRound size={10} /> {teamSize}
            </span>
          )}

          {!isHackathon && date && (
            <span className="flex items-center gap-1 text-[10.5px] text-gray-500">
              <CalendarDays size={10} /> {date}
            </span>
          )}

          {!isHackathon && mode && (
            <span className="flex items-center gap-1 text-[10.5px] text-gray-500">
              <MapPin size={10} /> {mode}
            </span>
          )}
        </div>

        {/* Categories */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {categories.slice(0, 3).map((cat) => (
              <span key={cat} className="flex items-center gap-0.5 text-[9.5px] font-medium text-gray-500 bg-gray-50 border border-gray-100 px-1.5 py-0.5 rounded-full">
                <Tag size={8} /> {cat}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-1.5 border-t border-gray-50">
          <span className="flex items-center gap-1 text-[10px] text-gray-400">
            <CalendarDays size={9} /> {postedAt}
          </span>

          <a
            href={applyUrl ?? platform.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-1 text-[10.5px] font-bold px-2.5 py-1.5 rounded-lg text-white ${accent.btn}`}
          >
            {isHackathon ? "Register" : "Join Now"}
            <ExternalLink size={9} />
          </a>
        </div>

      </div>
    </div>
  );
}