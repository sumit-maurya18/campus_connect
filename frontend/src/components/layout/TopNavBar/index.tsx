"use client";

import Link from "next/link";
import { Search, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

// ── Theme toggle ──────────────────────────────────────────
function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-9 h-9" />;

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
      className="
        w-9 h-9 rounded-full flex items-center justify-center
        text-gray-500 dark:text-gray-400
        hover:bg-gray-100 dark:hover:bg-gray-800
        transition-colors duration-200
      "
    >
      {theme === "dark"
        ? <Sun  size={18} strokeWidth={1.8} />
        : <Moon size={18} strokeWidth={1.8} />
      }
    </button>
  );
}

// ── TopNavBar ─────────────────────────────────────────────
interface TopNavBarProps {
  onMobileMenuClick?: () => void;
}

export default function TopNavBar({ onMobileMenuClick }: TopNavBarProps) {
  return (
    <div className="h-15 flex items-center justify-between px-8 bg-white dark:bg-gray-950 border-b border-gray-300 dark:border-gray-800 shadow-sm">

      {/* ── Brand Logo → home ── */}
      <Link
        href="/"
        className="flex items-center gap-0.5 select-none hover:opacity-80 transition-opacity duration-150"
      >
        <span
          className="text-[1.35rem] font-black tracking-[-0.04em] text-gray-950 dark:text-white"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Campus
        </span>
        <span
          className="text-[1.35rem] font-black tracking-[-0.04em]"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          +
        </span>
      </Link>

      {/* ── Search pill ── */}
      <button
        aria-label="Search"
        onClick={onMobileMenuClick}
        className="
          flex items-center gap-2.5 px-4 py-2.5 min-w-60
          bg-gray-100 dark:bg-gray-800
          border border-gray-500 dark:border-gray-600
          rounded-full text-sm
          transition-all duration-200
          hover:border-blue-400 hover:bg-white dark:hover:bg-gray-700
          hover:shadow-[0_0_0_4px_#eff6ff] dark:hover:shadow-[0_0_0_4px_#1e3a5f]
          focus:outline-none focus:border-blue-400
        "
      >
        <Search size={16} strokeWidth={2} className="text-gray-400 shrink-0" />
        <span className="text-gray-400 dark:text-gray-500 text-[13px]">
          Search opportunities...
        </span>
      </button>

    </div>
  );
}