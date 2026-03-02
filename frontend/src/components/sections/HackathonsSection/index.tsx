// src/components/sections/HackathonsSection/HackathonsSection.tsx

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionHeader from "@/components/common/SectionHeader";
import CompetitionCard from "@/components/common/CompetitionCard";
import { HACKATHONS } from "@/lib/constants/home.data";

export default function HackathonsSection() {
  return (
    <section id="hackathons">
      <SectionHeader
        title="Hackathons & Competitions"
        subtitle="Uncover the most talked-about competitions today."
        href="/hackathons"
        accentColor="bg-orange-500"
      />

      {/* 
        1 column on mobile, 2 on md+ — cards are wide horizontal splits
        so 2 cols fits perfectly on desktop
      */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {HACKATHONS.map((item, i) => (
          <CompetitionCard key={i} type="hackathon" {...item} />
        ))}
      </div>

      {/* <Link
        href="/hackathons"
        className="mt-4 flex items-center justify-center gap-2 w-full py-3 rounded-2xl border border-dashed border-orange-200 text-orange-500 text-sm font-semibold hover:bg-orange-50 transition-colors duration-200"
      >
        Explore More Hackathons <ArrowRight size={15} />
      </Link> */}
    </section>
  );
}