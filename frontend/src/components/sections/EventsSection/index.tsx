// src/components/sections/EventsSection/EventsSection.tsx

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionHeader from "@/components/common/SectionHeader";
import CompetitionCard from "@/components/common/CompetitionCard";
import { EVENTS } from "@/lib/constants/home.data";

export default function EventsSection() {
  return (
    <section id="events">
      <SectionHeader
        title="Events"
        subtitle="Workshops, webinars & networking sessions for you."
        href="/events"
        accentColor="bg-emerald-500"
      />

      {/* 
        1 column on mobile, 2 on md+ — cards are wide horizontal splits
        so 2 cols fits perfectly on desktop
      */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {EVENTS.map((item, i) => (
          <CompetitionCard key={i} type="event" {...item} />
        ))}
      </div>

      {/* <Link
        href="/events"
        className="mt-4 flex items-center justify-center gap-2 w-full py-3 rounded-2xl border border-dashed border-emerald-200 text-emerald-500 text-sm font-semibold hover:bg-emerald-50 transition-colors duration-200"
      >
        Explore More Events <ArrowRight size={15} />
      </Link> */}
    </section>
  );
}