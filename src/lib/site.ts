/**
 * Single source of truth for the canonical site origin and brand name.
 *
 * Prefers the build-time `NEXT_PUBLIC_SITE_URL` (set per-environment on Vercel:
 * production/preview → the live origin, development → http://localhost:3000) and
 * falls back to the production domain so server bundles never emit a wrong
 * canonical/og:url if the env var is missing.
 */
export const SITE_URL: string =
  process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "") ||
  "https://nicholasdamato.vercel.app";

/** Site/brand name used for og:siteName and JSON-LD. */
export const SITE_NAME = "Nicholas D'Amato";
