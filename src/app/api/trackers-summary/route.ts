import { NextRequest, NextResponse } from "next/server";
import { getAnalyticsSummary } from "@/lib/analyticsStore";

export const dynamic = "force-dynamic";

// Key-gated JSON feed for the private trackers dashboard. The summary is
// already PII-stripped (same data the public /analytics page renders);
// the key just keeps it from being trivially scraped.
export async function GET(request: NextRequest) {
  const key = request.nextUrl.searchParams.get("key");
  const expected = process.env.TRACKERS_ANALYTICS_KEY;
  if (!expected || key !== expected) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const summary = await getAnalyticsSummary();
  return NextResponse.json(summary, {
    headers: { "cache-control": "no-store" },
  });
}
