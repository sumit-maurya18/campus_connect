// src/components/sections/OurTeamSection/OurTeamSection.tsx
// ─────────────────────────────────────────────────────────
// Meet Our Team section.
// 6 team members in a responsive grid.
// Each card: gradient avatar, name, role, bio, LinkedIn + Twitter.
// Data from: src/lib/constants/site.data.ts → TEAM
// ─────────────────────────────────────────────────────────

import { TEAM } from "@/lib/constants/site.data";
import { Linkedin, Twitter } from "lucide-react";

export default function OurTeamSection() {
  return (
    <section id="team" className="space-y-10">

      {/* ── Header ── */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="inline-block font-extrabold tracking-widest text-violet-600 uppercase bg-violet-50 border border-violet-100 px-3 py-1 rounded-full">
          The Team
        </span>
        <h2 className="text-3xl font-black text-gray-900 leading-tight">
          Meet the people behind CareerUnlock
        </h2>
        <p className="text-[14px] text-gray-400 leading-relaxed">
          A small team with a big mission — making career opportunities accessible to every student.
        </p>
      </div>

      {/* ── Team grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {TEAM.map(({ name, role, bio, initials, color, linkedin, twitter }) => (
          <div
            key={name}
            className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col gap-4 group"
          >
            {/* Avatar + name row */}
            <div className="flex items-center gap-3">
              {/* Gradient avatar */}
              <div className={`
                w-14 h-14 rounded-2xl bg-linear-to-br ${color}
                flex items-center justify-center shrink-0
                shadow-sm group-hover:shadow-md transition-shadow duration-200
              `}>
                <span className="text-white font-black text-lg">{initials}</span>
              </div>

              <div>
                <p className="font-bold text-gray-900 text-[14.5px] leading-tight">{name}</p>
                <p className="text-[12px] text-gray-400 mt-0.5">{role}</p>
              </div>
            </div>

            {/* Bio */}
            <p className="text-[12.5px] text-gray-500 leading-relaxed flex-1">
              {bio}
            </p>

            {/* Social links */}
            <div className="flex items-center gap-2 pt-3 border-t border-gray-50">
              <a
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[11px] font-semibold text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-150"
              >
                <Linkedin size={11} /> LinkedIn
              </a>
              <a
                href={twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[11px] font-semibold text-sky-500 bg-sky-50 border border-sky-100 px-3 py-1.5 rounded-full hover:bg-sky-500 hover:text-white hover:border-sky-500 transition-all duration-150"
              >
                <Twitter size={11} /> Twitter
              </a>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
}