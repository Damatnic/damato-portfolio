import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Olympic Medal Pipeline | Nicholas D'Amato",
  description:
    "Interactive dashboard for the Olympic Medal Data Pipeline: 1,343 medal records from Tokyo 2020 and Beijing 2022, scraped, parsed, enriched, and filterable in the browser.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
