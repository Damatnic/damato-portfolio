import type { NextConfig } from "next";

// Baseline security headers applied to every response. Conservative set —
// no strict CSP, since this site loads Vercel Analytics + inline JSON-LD and a
// misconfigured CSP would break them for little gain on a static portfolio.
const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  // The site moved to nicholasdamato.vercel.app. The old damato-data alias is
  // still attached, so 301 any request hitting it over to the new canonical
  // host (keeps old links alive + consolidates SEO).
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "damato-data.vercel.app" }],
        destination: "https://nicholasdamato.vercel.app/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
