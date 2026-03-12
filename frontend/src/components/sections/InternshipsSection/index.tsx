import { MapPin, IndianRupee, Clock, BadgeCheck } from "lucide-react";
import SectionHeader from "@/components/common/SectionHeader";
import { type Internship } from "@/lib/api/opportunities";

import {
  initials,
  locationLabel,
  formatStipend
} from "@/lib/ui/format";

import {
  internshipCompany
} from "@/lib/ui/opportunityMapper";

interface Props {
  data: Internship[];
}

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

export default function InternshipsSection({ data }: Props) {

  const internships = data;

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

          {internships.map((item, i) => {

            const company = internshipCompany(item);

            return (
              <a
                key={item.id}
                href={item.apply_url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 hover:shadow-md hover:border-blue-100 dark:hover:border-blue-900 transition-all duration-200 block group"
              >

                <div className="flex items-start justify-between mb-3">

                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold ${logoColor(i)}`}
                  >
                    {initials(company)}
                  </div>

                  {item.is_verified && (
                    <BadgeCheck size={14} className="text-blue-500 mt-0.5" />
                  )}

                </div>

                <p className="font-bold text-gray-900 dark:text-gray-100 text-[13.5px] leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
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

                </div>

              </a>
            );
          })}

        </div>
      )}

    </section>
  );
}