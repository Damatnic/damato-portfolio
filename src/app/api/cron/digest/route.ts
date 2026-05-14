import { NextRequest, NextResponse } from "next/server";
import { dayKey, lastNDayKeys } from "@/lib/analyticsTime";
import type { AnalyticsRecord, AnalyticsSummary } from "@/lib/analyticsStore";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function kvConfig(): { url: string; token: string } | null {
  const url = process.env.KV_REST_API_URL?.trim();
  const token = process.env.KV_REST_API_TOKEN?.trim();
  if (!url || !token) return null;
  return { url, token };
}

async function kvCommand<T>(cmd: string[]): Promise<T | null> {
  const cfg = kvConfig();
  if (!cfg) return null;
  try {
    const res = await fetch(cfg.url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${cfg.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cmd),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { result?: T };
    return data.result ?? null;
  } catch {
    return null;
  }
}

function topN<K extends string>(
  items: Array<Record<K, string | number>>,
  key: K,
  n: number
): Array<Record<K, string | number> & { count: number }> {
  const counts = new Map<string, { count: number }>();
  for (const it of items) {
    const k = String(it[key] ?? "");
    if (!k) continue;
    const existing = counts.get(k);
    if (existing) existing.count += 1;
    else counts.set(k, { count: 1 });
  }
  return Array.from(counts.entries())
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, n)
    .map(([key, val]) => ({ [key as K]: key, count: val.count } as Record<K, string | number> & { count: number }));
}

function htmlDigest(summary: {
  today: string;
  totalEvents: number;
  pageviews: number;
  clicks: number;
  uniqueCountries: number;
  uniqueCities: number;
  uniqueSessions: number;
  bounceRate: number;
  avgDuration: string;
  topPaths: Array<{ path: string; count: number }>;
  topLinks: Array<{ href: string; label: string; count: number }>;
  topReferrers: Array<{ source: string; count: number }>;
  topCountries: Array<{ country: string; count: number }>;
  weekTrend: Array<{ date: string; pv: number; clicks: number }>;
}): string {
  const weekBars = summary.weekTrend
    .map(
      (d) =>
        `<tr><td style="padding:2px 8px;color:#a1a1aa">${d.date.slice(5)}</td><td style="padding:2px 8px">${d.pv}</td><td style="padding:2px 8px">${d.clicks}</td></tr>`
    )
    .join("");

  const paths = summary.topPaths
    .map((p) => `<tr><td style="padding:2px 8px;color:#d4d4d8">${p.path}</td><td style="padding:2px 8px;text-align:center">${p.count}</td></tr>`)
    .join("");
  const refs = summary.topReferrers
    .map((r) => `<tr><td style="padding:2px 8px;color:#d4d4d8">${r.source}</td><td style="padding:2px 8px;text-align:center">${r.count}</td></tr>`)
    .join("");
  const countries = summary.topCountries
    .map((c) => `<tr><td style="padding:2px 8px;color:#d4d4d8">${c.country}</td><td style="padding:2px 8px;text-align:center">${c.count}</td></tr>`)
    .join("");

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#09090b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#e4e4e7">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:40px 16px">
<table width="560" cellpadding="0" cellspacing="0" style="background:#18181b;border-radius:12px;border:1px solid #27272a">
<tr><td style="padding:32px 32px 16px">
<h1 style="margin:0;font-size:22px;font-weight:600;color:#f4f4f5">damato-data daily</h1>
<p style="margin:8px 0 0;font-size:13px;color:#a1a1aa">${summary.today}</p>
</td></tr>
<tr><td style="padding:16px 32px">
<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td width="25%" style="text-align:center;padding:12px 4px;background:#27272a;border-radius:8px"><div style="font-size:20px;font-weight:700;color:#f4f4f5">${summary.pageviews}</div><div style="font-size:10px;color:#a1a1aa;text-transform:uppercase;letter-spacing:0.5px;margin-top:2px">Pageviews</div></td>
<td width="8%"></td>
<td width="25%" style="text-align:center;padding:12px 4px;background:#27272a;border-radius:8px"><div style="font-size:20px;font-weight:700;color:#f4f4f5">${summary.clicks}</div><div style="font-size:10px;color:#a1a1aa;text-transform:uppercase;letter-spacing:0.5px;margin-top:2px">Clicks</div></td>
<td width="8%"></td>
<td width="25%" style="text-align:center;padding:12px 4px;background:#27272a;border-radius:8px"><div style="font-size:20px;font-weight:700;color:#f4f4f5">${summary.uniqueSessions}</div><div style="font-size:10px;color:#a1a1aa;text-transform:uppercase;letter-spacing:0.5px;margin-top:2px">Sessions</div></td>
</tr>
</table>
</td></tr>
<tr><td style="padding:8px 32px 16px">
<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td width="33%" style="text-align:center;font-size:13px;color:#a1a1aa">${summary.uniqueCountries} countries</td>
<td width="33%" style="text-align:center;font-size:13px;color:#a1a1aa">${summary.uniqueCities} cities</td>
<td width="33%" style="text-align:center;font-size:13px;color:#a1a1aa">${summary.bounceRate}% bounce</td>
</tr>
</table>
</td></tr>
<tr><td style="padding:0 32px">
<hr style="border:none;border-top:1px solid #27272a;margin:0">
</td></tr>
<tr><td style="padding:16px 32px">
<h2 style="margin:0 0 8px;font-size:14px;font-weight:600;color:#f4f4f5">7-day trend</h2>
<table width="100%" cellpadding="0" cellspacing="0" style="font-size:12px">
<tr style="color:#a1a1aa"><th align="left" style="padding:4px 8px;border-bottom:1px solid #27272a">Day</th><th align="left" style="padding:4px 8px;border-bottom:1px solid #27272a">Pageviews</th><th align="left" style="padding:4px 8px;border-bottom:1px solid #27272a">Clicks</th></tr>
${weekBars}
</table>
</td></tr>
<tr><td style="padding:0 32px">
<hr style="border:none;border-top:1px solid #27272a;margin:0">
</td></tr>
<tr><td style="padding:16px 32px">
<h2 style="margin:0 0 8px;font-size:14px;font-weight:600;color:#f4f4f5">Top pages</h2>
<table width="100%" cellpadding="0" cellspacing="0" style="font-size:12px">
${paths || "<p style='color:#a1a1aa;font-size:12px'>No pageviews yet</p>"}
</table>
</td></tr>
<tr><td style="padding:0 32px">
<hr style="border:none;border-top:1px solid #27272a;margin:0">
</td></tr>
<tr><td style="padding:16px 32px">
<h2 style="margin:0 0 8px;font-size:14px;font-weight:600;color:#f4f4f5">Traffic sources</h2>
<table width="100%" cellpadding="0" cellspacing="0" style="font-size:12px">
${refs || "<p style='color:#a1a1aa;font-size:12px'>No external referrers</p>"}
</table>
</td></tr>
<tr><td style="padding:0 32px">
<hr style="border:none;border-top:1px solid #27272a;margin:0">
</td></tr>
<tr><td style="padding:16px 32px">
<h2 style="margin:0 0 8px;font-size:14px;font-weight:600;color:#f4f4f5">Top countries</h2>
<table width="100%" cellpadding="0" cellspacing="0" style="font-size:12px">
${countries || "<p style='color:#a1a1aa;font-size:12px'>No location data</p>"}
</table>
</td></tr>
<tr><td style="padding:16px 32px 32px;text-align:center;font-size:11px;color:#52525b">
<a href="https://damato-portfolio-pearl.vercel.app/admin/analytics?secret=${process.env.ANALYTICS_SECRET ?? ""}" style="color:#818cf8;text-decoration:none">Full dashboard →</a>
</td></tr>
</table>
</td></tr></table>
</body>
</html>`;
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const cfg = kvConfig();
  if (!cfg) {
    return NextResponse.json({ error: "KV not configured" }, { status: 500 });
  }

  const eventStrs = await kvCommand<string[]>(["LRANGE", "analytics:events", "0", "999"]);
  const events: AnalyticsRecord[] = (eventStrs ?? [])
    .map((s) => {
      try {
        return JSON.parse(s) as AnalyticsRecord;
      } catch {
        return null;
      }
    })
    .filter((x): x is AnalyticsRecord => x !== null);

  const human = events.filter((e) => !e.bot);
  const pageviews = human.filter((e) => e.type === "pageview");
  const clicks = human.filter((e) => e.type === "link_click");
  const allEvents = human.length;

  const countries = new Set(human.map((e) => e.country).filter(Boolean));
  const cities = new Set(human.map((e) => e.city).filter(Boolean));

  const sessions = new Set(pageviews.map((e) => e.sessionId).filter(Boolean));
  const bounced = pageviews.filter(
    (e, _i, arr) => e.sessionId && arr.filter((p) => p.sessionId === e.sessionId).length === 1
  );
  const uniqueBounced = new Set(bounced.map((e) => e.sessionId).filter(Boolean));
  const bounceRate = sessions.size > 0 ? Math.round((uniqueBounced.size / sessions.size) * 100) : 0;

  const topPaths = topN(
    pageviews.map((e) => ({ path: e.path ?? "/" })),
    "path",
    5
  ) as Array<{ path: string; count: number }>;

  const topLinks = topN(
    clicks.map((e) => ({ href: e.href ?? "", label: e.label ?? "" })),
    "href",
    5
  ) as Array<{ href: string; label: string; count: number }>;

  const referrerSources = new Map<string, number>();
  for (const e of pageviews) {
    const src = e.referrer ?? "direct";
    const host = (() => {
      try {
        return new URL(src).hostname;
      } catch {
        return src;
      }
    })();
    if (host === "direct") continue;
    referrerSources.set(host, (referrerSources.get(host) ?? 0) + 1);
  }
  const topReferrers = Array.from(referrerSources.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([source, count]) => ({ source, count }));

  const countryCounts = new Map<string, number>();
  for (const e of human) {
    if (!e.country) continue;
    countryCounts.set(e.country, (countryCounts.get(e.country) ?? 0) + 1);
  }
  const topCountries = Array.from(countryCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([country, count]) => ({ country, count }));

  const now = Date.now();
  const buckets = lastNDayKeys(7, now);
  const counterCmds: string[][] = [];
  for (const d of buckets) {
    counterCmds.push(["GET", `analytics:counters:pageview:${d}`]);
    counterCmds.push(["GET", `analytics:counters:link_click:${d}`]);
  }
  let weekCounters: Array<string | null> = [];
  try {
    const res = await fetch(`${cfg.url}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${cfg.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(counterCmds),
      cache: "no-store",
    });
    if (res.ok) {
      const data = (await res.json()) as Array<{ result: string | null }>;
      weekCounters = data.map((c) => c.result);
    }
  } catch {
    /* leave empty */
  }

  const weekTrend = buckets.map((date, i) => ({
    date,
    pv: parseInt(weekCounters[i * 2] ?? "0", 10) || 0,
    clicks: parseInt(weekCounters[i * 2 + 1] ?? "0", 10) || 0,
  }));

  const today = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date());

  const resendKey = process.env.RESEND_API_KEY;
  const notifyTo = process.env.NOTIFY_EMAIL_TO;
  const notifyFrom = process.env.NOTIFY_EMAIL_FROM ?? "onboarding@resend.dev";

  if (!resendKey || !notifyTo) {
    return NextResponse.json({ error: "Resend or notify email not configured" }, { status: 500 });
  }

  const { Resend } = await import("resend");
  const resend = new Resend(resendKey);

  await resend.emails.send({
    from: notifyFrom,
    to: notifyTo,
    subject: `damato-data daily — ${dayKey(now)} (${pageviews.length} pv, ${clicks.length} clicks)`,
    html: htmlDigest({
      today,
      totalEvents: allEvents,
      pageviews: pageviews.length,
      clicks: clicks.length,
      uniqueCountries: countries.size,
      uniqueCities: cities.size,
      uniqueSessions: sessions.size,
      bounceRate,
      avgDuration: "—",
      topPaths,
      topLinks,
      topReferrers,
      topCountries,
      weekTrend,
    }),
  });

  return NextResponse.json({ ok: true, sent: true });
}
