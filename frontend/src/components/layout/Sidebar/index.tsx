"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Briefcase,
  Building2,
  Code2,
  CalendarDays,
  BookOpen,
  User,
  LogOut,
} from "lucide-react";

interface SidebarProps {
  onNavigate?: () => void;
}

const MAIN_NAV = [
  { label: "Home",        href: "/",           icon: Home },
  { label: "Internships", href: "/internships", icon: Briefcase },
  { label: "Jobs",        href: "/jobs",        icon: Building2 },
  { label: "Hackathons",  href: "/hackathons",  icon: Code2 },
  { label: "Events",      href: "/events",      icon: CalendarDays },
  { label: "Resources",   href: "/resources",   icon: BookOpen },
];

const BOTTOM_NAV = [
  { label: "Profile", href: "/profile", icon: User },
  { label: "Log out", href: "/logout",  icon: LogOut },
];

export default function Sidebar({ onNavigate }: SidebarProps) {

  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <aside className="flex flex-col w-60 h-screen bg-white border-r border-gray-300 shadow-sm">

      {/* User greeting */}
      <div className="flex items-center gap-3 px-5 pt-6 pb-5">
        <div className="w-10 h-10 rounded-full bg-linear-to-br from-orange-400 to-orange-500 flex items-center justify-center shadow-sm">
          <span className="text-white font-bold text-sm">A</span>
        </div>

        <div>
          <p className="text-sm font-semibold text-gray-900 leading-tight">
            Welcome, Alex
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            Ready to explore?
          </p>
        </div>
      </div>

      <div className="mx-4 border-t border-gray-200 my-2" />

      {/* Main navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <ul className="space-y-1">

          {MAIN_NAV.map(({ label, href, icon: Icon }) => {

            const active = isActive(href);

            const linkClass = active
              ? "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200 shadow-sm"
              : "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900";

            const iconClass = active
              ? "text-blue-700"
              : "text-gray-400 group-hover:text-gray-600";

            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={onNavigate}
                  className={linkClass}
                >
                  <Icon size={20} strokeWidth={2.2} className={iconClass} />
                  <span className={active ? "font-semibold" : ""}>
                    {label}
                  </span>
                </Link>
              </li>
            );
          })}

        </ul>
      </nav>

      <div className="mx-4 border-t border-gray-200 my-2" />

      {/* Bottom navigation */}
      <div className="px-3 py-4 space-y-1">

        {BOTTOM_NAV.map(({ label, href, icon: Icon }) => {

          const isLogout = label === "Log out";

          const linkClass = isLogout
            ? "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-500"
            : "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900";

          const iconClass = isLogout
            ? "text-gray-400 group-hover:text-red-400"
            : "text-gray-400 group-hover:text-gray-600";

          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={linkClass}
            >
              <Icon size={20} strokeWidth={2} className={iconClass} />
              <span>{label}</span>
            </Link>
          );
        })}

      </div>

    </aside>
  );
}