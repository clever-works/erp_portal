import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "Nexus ERP | Operations, in sync", description: "A clear view of your people, projects, and operations." };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
