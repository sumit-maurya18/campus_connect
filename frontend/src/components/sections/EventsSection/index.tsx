// src/components/sections/EventsSection/EventsSection.tsx
// Server Component — GET /api/events/upcoming?days=30&limit=4
// Uses CompetitionCard (type="event") with DB→prop mapping

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionHeader from "@/components/common/SectionHeader";
import CompetitionCard, { type Platform } from "@/components/common/CompetitionCard";
import { getUpcomingEvents, type EventOpportunity } from "@/lib/api/opportunities";

// ── DB column → CompetitionCard prop mapping ─────────────

function toPlatform(source: string | null | undefined): Platform {
  const map: Record<string, Platform> = {
    linkedin: "linkedin",
    unstop:   "unstop",
    naukri:   "naukri",
    careers:  "careers",
    devfolio: "unstop",
    manual:   "careers",
  };
  return map[source ?? ""] ?? "careers";
}

// fees ('paid' | 'unpaid') → tag label
function feesToTag(fees: string | null | undefined): string {
  if (fees === "unpaid") return "Free";
  if (fees === "paid")   return "Paid";
  return "Free"; // default to free if unknown
}

// event_date (TIMESTAMPTZ) → "Mar 12, 2026"
function formatEventDate(dateStr: string | null | undefined): string | undefined {
  if (!dateStr) return undefined;
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
}

// city + country → mode/location string for the card
function locationLabel(item: EventOpportunity): string | undefined {
  if (item.city && item.country) return `${item.city}, ${item.country}`;
  if (item.city)    return item.city;
  if (item.country) return item.country;
  return "Online"; // default
}

// posted_date → relative time
function relativeTime(dateStr: string | null | undefined): string {
  if (!dateStr) return "Recently";
  const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86_400_000);
  if (days === 0) return "Today";
  if (days === 1) return "1 day ago";
  if (days < 30)  return `${days} days ago`;
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export default async function EventsSection() {
  let events: EventOpportunity[] = [];
  try {
    // Fetch 4 upcoming events (2×2 grid looks better than 3)
    events = await getUpcomingEvents({ days: 30, limit: 4 });
  } catch (err) {
    console.error("EventsSection fetch failed:", err);
  }

  return (
    <section id="events">
      <SectionHeader
        title="Events"
        subtitle="Workshops, webinars & networking sessions for you."
        href="/events"
        accentColor="bg-emerald-500"
      />

      {events.length === 0 ? (
        <p className="text-sm text-gray-400 dark:text-gray-500 py-6 text-center">
          No upcoming events right now — check back soon!
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.map((item) => (
            <CompetitionCard
              key={item.id}
              type="event"
              // ── Core ──────────────────────────────────────
              title={item.title}
              org={item.organization ?? "Unknown organizer"}
              applyUrl={item.apply_url}
              // ── Status tag ────────────────────────────────
              tag={feesToTag(item.fees)}
              // ── Platform + trust ──────────────────────────
              postedOn={toPlatform(item.source)}
              verified={item.is_verified}
              postedAt={relativeTime(item.posted_date)}
              // ── Event-specific ────────────────────────────
              date={formatEventDate(item.event_date)}
              mode={locationLabel(item)}
              // seats: not in schema, leave undefined
              seats={undefined}
              // ── Categories ───────────────────────────────
              categories={item.domain ?? item.tags ?? []}
            />
          ))}
        </div>
      )}

    </section>
  );
}