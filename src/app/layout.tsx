import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nicholas D'Amato — Junior Data Analyst",
  description:
    "Junior Data Analyst pivoting from IT support. Python, SQL, Power BI work plus production full-stack experience. AAS in AI Data Specialist at WCTC.",
  metadataBase: new URL("https://damato-data.vercel.app"),
  openGraph: {
    title: "Nicholas D'Amato — Junior Data Analyst",
    description:
      "Junior Data Analyst | Python · SQL · Power BI | Open to Part-Time & Internship",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100">
        {children}
      </body>
    </html>
  );
}
