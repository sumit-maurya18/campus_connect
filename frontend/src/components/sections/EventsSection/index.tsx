import SectionHeader from "@/components/common/SectionHeader";
import CompetitionCard, { type Platform } from "@/components/common/CompetitionCard";
import { type EventOpportunity } from "@/lib/api/opportunities";

import {
  relativeTime
} from "@/lib/ui/format";

import {
  feesToTag
} from "@/lib/ui/opportunityMapper";

interface Props {
  data: EventOpportunity[];
}

function toPlatform(source?: string | null): Platform {

  const map: Record<string, Platform> = {
    linkedin: "linkedin",
    unstop: "unstop",
    naukri: "naukri",
    careers: "careers",
    devfolio: "unstop",
    manual: "careers"
  };

  return map[source ?? ""] ?? "careers";
}

function formatEventDate(dateStr?: string | null) {

  if (!dateStr) return undefined;

  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

function locationLabel(item: EventOpportunity) {

  if (item.city && item.country)
    return `${item.city}, ${item.country}`;

  if (item.city) return item.city;
  if (item.country) return item.country;

  return "Online";
}

export default function EventsSection({ data }: Props) {

  const events = data;

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

          {events.map(item => (

            <CompetitionCard
              key={item.id}
              type="event"
              title={item.title}
              org={item.organization ?? "Unknown organizer"}
              applyUrl={item.apply_url}
              tag={feesToTag(item.fees)}
              postedOn={toPlatform(item.source)}
              verified={item.is_verified}
              postedAt={relativeTime(item.posted_date)}
              date={formatEventDate(item.event_date)}
              mode={locationLabel(item)}
              seats={undefined}
              categories={item.domain ?? item.tags ?? []}
            />

          ))}

        </div>

      )}

    </section>
  );
}