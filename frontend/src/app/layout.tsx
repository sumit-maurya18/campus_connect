// src/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import AppShell from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "CareerUnlock – Find Your Opportunity",
  description: "Find internships, jobs, hackathons, and courses tailored for students.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppShell>
          {children}
        </AppShell>
      </body>
    </html>
  );
}