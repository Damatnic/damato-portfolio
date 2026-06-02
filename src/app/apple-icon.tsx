import { ImageResponse } from "next/og";

// iOS home-screen / bookmark icon. Mirrors the gold "N" monogram in icon.svg.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0c0a09",
        }}
      >
        <svg
          width="132"
          height="132"
          viewBox="0 0 32 32"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9 23 V9 h2.6 l9 11.2 V9 H23 v14 h-2.6 l-9-11.2 V23 z"
            fill="#e8b53d"
          />
        </svg>
      </div>
    ),
    { ...size },
  );
}
