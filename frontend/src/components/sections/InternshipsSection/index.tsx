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
      
    </section>
  );
}