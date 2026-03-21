import { MapPin, Clock, BadgeCheck } from "lucide-react";
import SectionHeader from "@/components/common/SectionHeader";
import { type Job } from "@/lib/api/opportunities";

import {
  initials,
  locationLabel
} from "@/lib/ui/format";

import {
  jobCompany
} from "@/lib/ui/opportunityMapper";

interface Props {
  data: Job[];
}

const LOGO_COLORS = [
  "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
  "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
  "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
  "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
];

function logoColor(i: number) {
  return LOGO_COLORS[i % LOGO_COLORS.length];
}

export default function JobsSection({ data }: Props) {

  const jobs = data ?? [];

  return (
    <section id="jobs">

      <SectionHeader
        title="Jobs"
        subtitle="Unveil jobs designed for your next big move."
        href="/jobs"
        accentColor="bg-violet-500"
      />

      {jobs.length === 0 ? (
        <p className="text-sm text-gray-400 dark:text-gray-500 py-6 text-center">
          No jobs right now — check back soon!
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {jobs.map((item, i) => {

            const company = jobCompany(item);

            return (
              <a
                key={item.id}
                href={item.apply_url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 hover:shadow-md hover:border-violet-100 dark:hover:border-violet-900 transition-all duration-200 block group"
              >

                <div className="flex items-start justify-between mb-3">

                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold ${logoColor(i)}`}>
                    {initials(company)}
                  </div>

                  {item.is_verified && (
                    <BadgeCheck size={14} className="text-blue-500 mt-0.5" />
                  )}

                </div>

                <p className="font-bold text-gray-900 dark:text-gray-100 text-[13.5px] leading-snug group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors line-clamp-2">
                  {item.title}
                </p>

                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 truncate">
                  {company}
                </p>

                <div className="flex items-center gap-3 mt-3 text-xs text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1 capitalize">
                    <MapPin size={11} />
                    {locationLabel(item.city, item.work_style)}
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-3 flex-wrap">

                  {item.salary && (
                    <span className="text-[10px] font-semibold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950 px-2 py-0.5 rounded-full">
                      {item.salary}
                    </span>
                  )}

                  {item.experience && (
                    <span className="flex items-center gap-1 text-[10px] font-medium text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 px-2 py-0.5 rounded-full">
                      <Clock size={9} />
                      {item.experience}
                    </span>
                  )}

                </div>

              </a>
            );
          })}

        </div>
      )}

    </section>
  );
}