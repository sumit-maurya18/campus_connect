// src/app/page.tsx
// ─────────────────────────────────────────────────────────
// Home page — pure assembler.
// This file ONLY composes sections. Zero logic here.
//
// To add/remove a section: import it and add/remove one line.
// To edit a section: go to its own file under src/components/sections/
// ─────────────────────────────────────────────────────────

import HeroSection        from "@/components/sections/HeroSection";
import HackathonCollage   from "@/components/sections/HackathonCollage";
import InternshipsSection from "@/components/sections/InternshipsSection";
import JobsSection        from "@/components/sections/JobsSection";
import HackathonsSection  from "@/components/sections/HackathonsSection";
import EventsSection      from "@/components/sections/EventsSection";
import AboutSection from "@/components/sections/AboutSection";
import OurTeamSection from "@/components/sections/OurTeamSection";
import Footer from "@/components/layout/Footer";

export default function HomePage() {
  return (
    <div className="space-y-14">
      <HeroSection />
      <HackathonCollage />
      <InternshipsSection />
      <JobsSection />
      <HackathonsSection />
      <EventsSection />
      <AboutSection/>
      <OurTeamSection/>
      
    </div>
  );
}