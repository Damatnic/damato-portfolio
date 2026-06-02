import { ImageResponse } from "next/og";
import { SITE_URL } from "@/lib/site";

/** Shared dimensions/content-type for dynamic Open Graph images. */
export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const BG = "#0c0a09";
const FG = "#f5f5f4";
const ACCENT = "#2dd4bf";
const MUTED = "#a8a29e";
const FAINT = "#78716c";

/**
 * Renders an on-brand 1200×630 social card: dark background, a teal uppercase
 * kicker, a large title, a muted tagline, and a footer with the name + domain.
 * Used by per-page `opengraph-image.tsx` route files.
 */
export function renderOgImage({
  kicker,
  title,
  tagline,
}: {
  kicker: string;
  title: string;
  tagline: string;
}): ImageResponse {
  const domain = SITE_URL.replace(/^https?:\/\//, "");
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: BG,
          color: FG,
        }}
      >
        <div
          style={{
            fontSize: 28,
            letterSpacing: 8,
            textTransform: "uppercase",
            color: ACCENT,
          }}
        >
          {kicker}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 76, fontWeight: 600, lineHeight: 1.05 }}>
            {title}
          </div>
          <div style={{ fontSize: 34, color: MUTED, marginTop: 28, lineHeight: 1.3 }}>
            {tagline}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 26,
            color: FAINT,
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: 14,
                background: ACCENT,
                marginRight: 16,
              }}
            />
            <span style={{ color: MUTED }}>Nicholas D&apos;Amato</span>
          </div>
          <span>{domain}</span>
        </div>
      </div>
    ),
    { ...ogSize },
  );
}
