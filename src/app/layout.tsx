import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { ClickTracker } from "@/components/ClickTracker";
import "./globals.css";

const SITE_URL = "https://damato-data.vercel.app";

export const metadata: Metadata = {
  title: "Nicholas D'Amato | Junior Data Analyst",
  description:
    "Junior data analyst pivoting from IT support. Python, SQL, Power BI work. Finishing an AAS in AI Data Specialist at WCTC.",
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "/" },
  openGraph: {
    title: "Nicholas D'Amato | Junior Data Analyst",
    description:
      "Junior Data Analyst. Python, SQL, Power BI. Open to part-time and internship roles.",
    type: "website",
    url: SITE_URL,
    siteName: "damato-data",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nicholas D'Amato | Junior Data Analyst",
    description:
      "Junior Data Analyst. Python, SQL, Power BI. Open to part-time and internship roles.",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0c0a09",
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Nicholas D'Amato",
  url: SITE_URL,
  jobTitle: "Junior Data Analyst",
  email: "mailto:nickdamatoit@gmail.com",
  address: { "@type": "PostalAddress", addressLocality: "Pewaukee", addressRegion: "WI" },
  sameAs: [
    "https://github.com/Damatnic",
    "https://linkedin.com/in/nicholas-damato2",
  ],
  alumniOf: [
    { "@type": "CollegeOrUniversity", name: "Waukesha County Technical College" },
    { "@type": "CollegeOrUniversity", name: "Milwaukee Area Technical College" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-stone-950 text-stone-100">
        <a
          href="#main"
          className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-3 focus-visible:left-3 focus-visible:z-50 focus-visible:rounded-md focus-visible:bg-[var(--accent)] focus-visible:px-3 focus-visible:py-2 focus-visible:text-sm focus-visible:font-medium focus-visible:text-stone-950 focus-visible:shadow-lg"
        >
          Skip to content
        </a>
        {children}
        <Analytics />
        <ClickTracker />
        <Script id="ld-person" type="application/ld+json" strategy="afterInteractive">
          {JSON.stringify(personJsonLd)}
        </Script>
      </body>
    </html>
  );
}
