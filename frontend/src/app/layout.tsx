// src/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import AppShell from "@/components/layout/AppShell";
import { ThemeProvider } from "next-themes";

export const metadata: Metadata = {
  title: "Campus Connect : Your Gateway to Opportunities",
  description: "Find internships, jobs, hackathons, and courses tailored for students.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AppShell>
            {children}
            </AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}