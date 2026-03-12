"use client";

import Link from "next/link";
import { Search, Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export default function TopNavBar() {

  return (
    <header className="hidden md:flex h-15 items-center justify-between px-8 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 shadow-sm">

      <Link
        href="/"
        className="flex items-center gap-0.5 select-none hover:opacity-80 transition-opacity"
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
            background: "linear-gradient(135deg,#2563eb 0%,#7c3aed 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          +
        </span>
      </Link>

      <button
        aria-label="Search opportunities"
        className="flex items-center gap-2.5 px-4 py-2.5 min-w-60 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-full text-sm hover:bg-white dark:hover:bg-gray-700 hover:border-blue-400 transition-all"
      >
        <Search size={16} className="text-gray-400" />
        <span className="text-gray-400 text-[13px]">
          Search opportunities...
        </span>
      </button>

    </header>
  );
}