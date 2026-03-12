import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import AppShell from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: {
    default: "Campus Connect",
    template: "%s | Campus Connect"
  },
  description:
    "Find internships, jobs, hackathons and learning opportunities curated for students.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  openGraph: {
    title: "Campus Connect",
    description:
      "Discover internships, jobs, hackathons and learning programs.",
    type: "website"
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AppShell>
            {children}
          </AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}