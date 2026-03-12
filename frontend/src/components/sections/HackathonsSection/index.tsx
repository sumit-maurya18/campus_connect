// src/components/sections/HackathonsSection/HackathonsSection.tsx
// Server Component — GET /api/hackathons/featured?limit=3
// Uses CompetitionCard (type="hackathon") with DB→prop mapping

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionHeader from "@/components/common/SectionHeader";
import CompetitionCard, { type Platform } from "@/components/common/CompetitionCard";
import { getFeaturedHackathons, type Hackathon } from "@/lib/api/opportunities";

// ── DB column → CompetitionCard prop mapping ─────────────

// source (VARCHAR) → Platform key
// Your DB stores: 'linkedin' | 'unstop' | 'naukri' | 'careers' | 'devfolio' | 'manual'
// CompetitionCard only knows: 'linkedin' | 'unstop' | 'naukri' | 'careers'
function toPlatform(source: string | null | undefined): Platform {
  const map: Record<string, Platform> = {
    linkedin: "linkedin",
    unstop:   "unstop",
    naukri:   "naukri",
    careers:  "careers",
    devfolio: "unstop",  // devfolio → show as unstop (closest)
    manual:   "careers", // manual → show as careers
  };
  return map[source ?? ""] ?? "careers";
}

// deadline (TIMESTAMPTZ) → tag label for the card
function deriveTag(deadline: string | null | undefined, fees: string | null | undefined): string {
  if (!deadline) return fees === "unpaid" ? "Free" : "Open";
  const daysLeft = Math.ceil((new Date(deadline).getTime() - Date.now()) / 86_400_000);
  if (daysLeft <= 0)  return "Closed";
  if (daysLeft <= 3)  return "Closing Soon";
  if (daysLeft <= 10) return "Registering";
  return "Open";
}

// deadline (TIMESTAMPTZ) → human readable "Apr 15"
function formatDeadline(deadline: string | null | undefined): string | undefined {
  if (!deadline) return undefined;
  return new Date(deadline).toLocaleDateString("en-IN", {
    day: "numeric", month: "short",
  });
}

// posted_date (TIMESTAMPTZ) → relative "2 days ago"
function relativeTime(dateStr: string | null | undefined): string {
  if (!dateStr) return "Recently";
  const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86_400_000);
  if (days === 0) return "Today";
  if (days === 1) return "1 day ago";
  if (days < 30)  return `${days} days ago`;
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export default async function HackathonsSection() {
  let hackathons: Hackathon[] = [];
  try {
    hackathons = await getFeaturedHackathons(3);
  } catch (err) {
    console.error("HackathonsSection fetch failed:", err);
  }

  return (
    <section id="hackathons">
      <SectionHeader
        title="Hackathons & Competitions"
        subtitle="Uncover the most talked-about competitions today."
        href="/hackathons"
        accentColor="bg-orange-500"
      />

      {hackathons.length === 0 ? (
        <p className="text-sm text-gray-400 dark:text-gray-500 py-6 text-center">
          No hackathons right now — check back soon!
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {hackathons.map((item) => (
            <CompetitionCard
              key={item.id}
              type="hackathon"
              // ── Core ──────────────────────────────────────
              title={item.title}
              org={item.organization ?? "Unknown organizer"}
              applyUrl={item.apply_url}
              // ── Status tag ────────────────────────────────
              tag={deriveTag(item.deadline, item.fees)}
              // ── Platform + trust ──────────────────────────
              postedOn={toPlatform(item.source)}
              verified={item.is_verified}
              postedAt={relativeTime(item.posted_date)}
              // ── Hackathon-specific ────────────────────────
              // prize: not in schema, use perks as fallback label
              prize={item.perks?.split(",")[0] ?? undefined}
              deadline={formatDeadline(item.deadline)}
              teamSize={item.team_size ?? undefined}
              // participants: not in schema, leave undefined
              participants={undefined}
              // ── Categories ───────────────────────────────
              // domain[] is the array field in opportunities_event
              categories={item.domain ?? item.tags ?? []}
            />
          ))}
        </div>
      )}

    </section>
  );
}