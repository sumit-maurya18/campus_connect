import HeroSection from "@/components/sections/HeroSection";
import HackathonCollage from "@/components/sections/HackathonCollage";

import InternshipsSection from "@/components/sections/InternshipsSection";
import JobsSection from "@/components/sections/JobsSection";
import HackathonsSection from "@/components/sections/HackathonsSection";
import EventsSection from "@/components/sections/EventsSection";

import AboutSection from "@/components/sections/AboutSection";
import OurTeamSection from "@/components/sections/OurTeamSection";

import { getHomeData } from "@/lib/api/home";

/* ISR cache window */
export const revalidate = 60;

export default async function HomePage() {

  const data = await getHomeData();

  return (
    <div className="space-y-14">

      <HeroSection />

      <HackathonCollage />

      <InternshipsSection data={data.internships} />

      <JobsSection data={data.jobs} />

      <HackathonsSection data={data.hackathons} />

      <EventsSection data={data.events} />

      <AboutSection />

      <OurTeamSection />

    </div>
  );
}