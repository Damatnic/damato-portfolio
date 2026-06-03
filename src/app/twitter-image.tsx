import { ogContentType, ogSize, renderOgImage } from "@/lib/og";

export const alt = "Nicholas D'Amato, Junior Data Analyst portfolio";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage({
    kicker: "Portfolio",
    title: "Nicholas D'Amato",
    tagline: "Junior Data Analyst. Python, SQL, and Power BI work.",
  });
}
