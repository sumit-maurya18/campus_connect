// src/components/sections/JobsSection/JobsSection.tsx

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionHeader from "@/components/common/SectionHeader";
import OpportunityCard from "@/components/common/OpportunityCard";
import { JOBS } from "@/lib/constants/home.data";

export default function JobsSection() {
  return (
    <section id="jobs">
      <SectionHeader
        title="Jobs"
        subtitle="Unveil jobs designed for your next big move."
        href="/jobs"
        accentColor="bg-violet-500"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {JOBS.map((item, i) => (
          <OpportunityCard key={i} type="job" {...item} />
        ))}
      </div>

      {/* <Link
        href="/jobs"
        className="mt-4 flex items-center justify-center gap-2 w-full py-3 rounded-2xl border border-dashed border-violet-200 text-violet-500 text-sm font-semibold hover:bg-violet-50 transition-colors duration-200"
      >
        Explore More Jobs <ArrowRight size={15} />
      </Link> */}
    </section>
  );
}