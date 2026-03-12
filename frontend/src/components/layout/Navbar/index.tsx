"use client";

import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

const PAGE_TITLES: Record<string, string> = {
  "/": "Home",
  "/internships": "Internships",
  "/jobs": "Jobs",
  "/hackathons": "Hackathons",
  "/events": "Events",
  "/resources": "Resources",
  "/profile": "Profile",
};

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {

  const pathname = usePathname();

  const pageTitle =
    Object.entries(PAGE_TITLES).find(([key]) =>
      key === "/" ? pathname === "/" : pathname.startsWith(key)
    )?.[1] ?? "Explore";

  return (
    <header className="md:hidden flex items-center gap-3 h-14 px-4 bg-white border-b border-gray-200 sticky top-0 z-50">

      <button
        onClick={onMenuClick}
        aria-label="Open menu"
        className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
      >
        <Menu size={20} />
      </button>

      <span className="text-base font-bold text-gray-900">
        {pageTitle}
      </span>

    </header>
  );
}