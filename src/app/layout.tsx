import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nicholas D'Amato | Junior Data Analyst",
  description:
    "Junior data analyst pivoting from IT support. Python, SQL, Power BI work. Finishing an AAS in AI Data Specialist at WCTC.",
  metadataBase: new URL("https://damato-data.vercel.app"),
  openGraph: {
    title: "Nicholas D'Amato | Junior Data Analyst",
    description:
      "Junior Data Analyst. Python, SQL, Power BI. Open to part-time and internship roles.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-stone-950 text-stone-100">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
