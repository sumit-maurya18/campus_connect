// src/components/sections/InternshipsSection/InternshipsSection.tsx

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionHeader from "@/components/common/SectionHeader";
import OpportunityCard from "@/components/common/OpportunityCard";
import { INTERNSHIPS } from "@/lib/constants/home.data";

export default function InternshipsSection() {
  return (
    <section id="internships">
      <SectionHeader
        title="Internships"
        subtitle="Unleash internships tailored to your aspirations."
        href="/internships"
        accentColor="bg-blue-500"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {INTERNSHIPS.map((item, i) => (
          <OpportunityCard key={i} type="internship" {...item} />
        ))}
      </div>

      {/* <Link
        href="/internships"
        className="mt-4 flex items-center justify-center gap-2 w-full py-3 rounded-2xl border border-dashed border-blue-200 text-blue-500 text-sm font-semibold hover:bg-blue-50 transition-colors duration-200"
      >
        Explore More Internships <ArrowRight size={15} />
      </Link> */}
    </section>
  );
}