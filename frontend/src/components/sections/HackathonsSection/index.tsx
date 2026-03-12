import SectionHeader from "@/components/common/SectionHeader";
import CompetitionCard, { type Platform } from "@/components/common/CompetitionCard";
import { type Hackathon } from "@/lib/api/opportunities";

import {
  relativeTime
} from "@/lib/ui/format";

import {
  hackathonTag
} from "@/lib/ui/opportunityMapper";

interface Props {
  data: Hackathon[];
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

function formatDeadline(deadline?: string | null) {

  if (!deadline) return undefined;

  return new Date(deadline).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short"
  });
}

export default function HackathonsSection({ data }: Props) {

  const hackathons = data;

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

          {hackathons.map(item => (

            <CompetitionCard
              key={item.id}
              type="hackathon"
              title={item.title}
              org={item.organization ?? "Unknown organizer"}
              applyUrl={item.apply_url}
              tag={hackathonTag(item.deadline)}
              postedOn={toPlatform(item.source)}
              verified={item.is_verified}
              postedAt={relativeTime(item.posted_date)}
              prize={item.perks?.split(",")[0] ?? undefined}
              deadline={formatDeadline(item.deadline)}
              teamSize={item.team_size ?? undefined}
              participants={undefined}
              categories={item.domain ?? item.tags ?? []}
            />

          ))}

        </div>

      )}

    </section>
  );
}