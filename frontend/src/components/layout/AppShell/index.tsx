"use client";

// src/components/layout/AppShell.tsx
// ─────────────────────────────────────────────────────────
// Master layout. Plugged into src/app/layout.tsx.
//
// DESKTOP (md+):
//   ┌─────────────┬────────────────────────────────────┐
//   │             │  ScrollAwareTopBar (scrolls away)  │
//   │  Sidebar    ├────────────────────────────────────┤
//   │  (fixed     │                                    │
//   │   240px)    │  <page content>                    │
//   │             │                                    │
//   └─────────────┴────────────────────────────────────┘
//
// MOBILE (<md):
//   ┌────────────────────────────────────────────────────┐
//   │  TopNavbar — sticky (hamburger + page title)       │
//   ├────────────────────────────────────────────────────┤
//   │  ScrollAwareTopBar (logo + search, scrolls away)   │
//   ├────────────────────────────────────────────────────┤
//   │  <page content>                                    │
//   └────────────────────────────────────────────────────┘
//   Sidebar slides over content from left
//
// ── PHASE 2 AUTH HOOK ────────────────────────────────────
// When auth is ready, add these 3 lines before the return:
//
//   const pathname = usePathname();
//   const isAuthPage = ["/login", "/signup"].includes(pathname);
//   if (isAuthPage) return <>{children}</>;
// ─────────────────────────────────────────────────────────

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import TopNavBar from "@/components/layout/TopNavBar";

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      {/* ── Mobile backdrop ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar ──
           Desktop: always visible, sticky
           Mobile:  fixed, slides in/out from left           */}
      <div
        className={`
          fixed md:sticky top-0 left-0 z-50 h-screen
          transition-transform duration-200 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <Sidebar />
      </div>

      {/* ── Right side: everything except the sidebar ── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

        {/* Sticky mobile hamburger bar — hidden on desktop */}
        <Navbar onMenuClick={() => setSidebarOpen((p) => !p)} />

        {/* Scrollable column — TopBar + page content scroll together */}
        <div className="flex-1 overflow-y-auto">

          {/* Logo + Search — scrolls away as user scrolls */}
          <TopNavBar />

          {/* Page content injected here by Next.js routing */}
          <main className="px-8 py-7">
            {children}
          </main>

        </div>
      </div>

    </div>
  );
}