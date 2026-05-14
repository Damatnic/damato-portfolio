import { NextResponse } from "next/server";
import { getAnalyticsSummary } from "@/lib/analyticsStore";

/**
 * Public read-only stats endpoint. Returns a small, PII-free slice of the
 * analytics dashboard so the homepage can prove the site is actually used.
 * No paths, no referrers, no session data, no per-visit detail. Just counts.
 */
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const summary = await getAnalyticsSummary();

  if (!summary.kvConfigured) {
    return NextResponse.json({ kvConfigured: false }, { status: 200 });
  }

  const last7Pageviews = summary.countersLast7Days.reduce(
    (sum, d) => sum + d.pageviews,
    0,
  );
  const last7Days = summary.countersLast7Days.map((d) => d.pageviews);

  return NextResponse.json(
    {
      kvConfigured: true,
      last7Pageviews,
      last7Days,
      uniqueCountries: summary.uniqueCountries,
      uniqueSessions: summary.uniqueSessions,
      resumeDownloads: summary.resumeDownloads,
    },
    {
      status: 200,
      headers: {
        // Brief cache so a flood of homepage views doesn't hammer KV.
        "Cache-Control": "public, max-age=60, s-maxage=60",
      },
    },
  );
}
