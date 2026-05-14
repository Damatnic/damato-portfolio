import { NextRequest, NextResponse } from "next/server";
import { dayKey } from "@/lib/analyticsTime";
import { getAnalyticsSummary, countryFlag } from "@/lib/analyticsStore";
import type { AnalyticsSummary } from "@/lib/analyticsStore";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function analyticsDashboardUrl(): string {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "") ??
    "https://damato-data.vercel.app";
  const secret = process.env.ANALYTICS_SECRET ?? "";
  return `${base}/admin/analytics?secret=${encodeURIComponent(secret)}`;
}

function trendArrow(pct: number | null): string {
  if (pct === null) return "·";
  if (pct === 0) return "→";
  return pct > 0 ? "↑" : "↓";
}

function trendLabel(pct: number | null): string {
  if (pct === null) return "new";
  if (pct === 0) return "flat";
  return `${pct > 0 ? "+" : ""}${pct}%`;
}

function trendColor(pct: number | null): string {
  if (pct === null) return "#a1a1aa";
  if (pct === 0) return "#a1a1aa";
  return pct > 0 ? "#34d399" : "#fb7185";
}

/** Inline SVG bar sparkline. Renders in Gmail web, Apple Mail, Outlook 365. */
function sparkline(values: number[], color: string, width = 200, height = 36): string {
  if (values.length === 0) return "";
  const max = Math.max(...values, 1);
  const gap = 2;
  const barW = Math.max((width - gap * (values.length - 1)) / values.length, 1);
  const bars = values
    .map((v, i) => {
      const h = Math.max((v / max) * (height - 2), 1);
      const x = i * (barW + gap);
      const y = height - h;
      return `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${barW.toFixed(1)}" height="${h.toFixed(1)}" rx="1" fill="${color}"/>`;
    })
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="7-day trend">${bars}</svg>`;
}

function buildHighlights(summary: AnalyticsSummary): string[] {
  const out: string[] = [];
  const todayStart = (() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  })();

  const downloadsToday = summary.recentResumeDownloads.filter((d) => d.ts >= todayStart).length;
  if (downloadsToday > 0) {
    const word = downloadsToday === 1 ? "download" : "downloads";
    out.push(`<strong>${downloadsToday} resume ${word}</strong> today.`);
  }

  // New country in the last 24h: appears in this week's events but not in any prior recent window
  const sevenDaysAgo = Date.now() - 7 * 86_400_000;
  const recentCountries = new Set(
    summary.recent
      .filter((e) => !e.bot && (e.receivedAt ?? e.ts) >= todayStart)
      .map((e) => e.country)
      .filter(Boolean) as string[]
  );
  const priorCountries = new Set(
    summary.recent
      .filter((e) => !e.bot && (e.receivedAt ?? e.ts) < todayStart && (e.receivedAt ?? e.ts) >= sevenDaysAgo)
      .map((e) => e.country)
      .filter(Boolean) as string[]
  );
  const newCountries = Array.from(recentCountries).filter((c) => !priorCountries.has(c));
  if (newCountries.length > 0) {
    const labels = newCountries.map((c) => `${countryFlag(c)} ${c}`).join(", ");
    out.push(`First visit today from ${labels}.`);
  }

  const top = summary.topReferrers[0];
  if (top && top.count > 0) {
    try {
      const host = new URL(top.referrer).hostname;
      out.push(`Top referrer this week: <strong>${host}</strong> (${top.count} visits).`);
    } catch {
      out.push(`Top referrer this week: <strong>${top.referrer}</strong> (${top.count} visits).`);
    }
  }

  return out;
}

function htmlDigest(summary: AnalyticsSummary, dashboardUrl: string, today: string): string {
  const accent = "#2dd4bf";
  const muted = "#a1a1aa";
  const card = "#27272a";
  const surface = "#18181b";
  const bg = "#09090b";

  const pvSpark = sparkline(summary.countersLast7Days.map((d) => d.pageviews), accent);
  const clickSpark = sparkline(summary.countersLast7Days.map((d) => d.clicks), "#a1a1aa");

  const pvDelta = summary.weeklyDelta.pageviewsPct;
  const clickDelta = summary.weeklyDelta.clicksPct;
  const sessionDelta = summary.weeklyDelta.sessionsPct;

  const highlights = buildHighlights(summary);

  const pathsRows = summary.topPaths
    .slice(0, 5)
    .map(
      (p) =>
        `<tr><td style="padding:4px 8px;color:#d4d4d8;font-family:ui-monospace,monospace">${p.path}</td><td style="padding:4px 8px;text-align:right;color:#f4f4f5">${p.count}</td></tr>`
    )
    .join("");
  const refRows = summary.topReferrers
    .slice(0, 5)
    .map((r) => {
      let host = r.referrer;
      try { host = new URL(r.referrer).hostname; } catch {}
      return `<tr><td style="padding:4px 8px;color:#d4d4d8">${host}</td><td style="padding:4px 8px;text-align:right;color:#f4f4f5">${r.count}</td></tr>`;
    })
    .join("");
  const countryRows = summary.topCountries
    .slice(0, 5)
    .map(
      (c) =>
        `<tr><td style="padding:4px 8px;color:#d4d4d8">${countryFlag(c.code)} ${c.country}</td><td style="padding:4px 8px;text-align:right;color:#f4f4f5">${c.count}</td></tr>`
    )
    .join("");

  const resumeRows = summary.recentResumeDownloads
    .slice(0, 5)
    .map((d) => {
      const time = new Date(d.ts).toLocaleString("en-US", {
        timeZone: process.env.NEXT_PUBLIC_SITE_TZ?.trim() || "America/Chicago",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      const loc = [d.city, d.country].filter(Boolean).join(", ") || "—";
      return `<tr><td style="padding:4px 8px;color:#d4d4d8;font-family:ui-monospace,monospace;font-size:11px">${time}</td><td style="padding:4px 8px;color:#d4d4d8">${countryFlag(d.country)} ${loc}</td></tr>`;
    })
    .join("");

  const highlightsBlock = highlights.length
    ? `<tr><td style="padding:16px 32px"><div style="background:${card};border-radius:8px;padding:12px 16px"><div style="font-size:10px;text-transform:uppercase;letter-spacing:0.5px;color:${muted};margin-bottom:6px">Highlights</div>${highlights.map((h) => `<div style="font-size:13px;color:#e4e4e7;line-height:1.5;margin-top:2px">• ${h}</div>`).join("")}</div></td></tr>`
    : "";

  const resumeBlock = resumeRows
    ? `<tr><td style="padding:0 32px"><hr style="border:none;border-top:1px solid ${card};margin:0"></td></tr><tr><td style="padding:16px 32px"><h2 style="margin:0 0 8px;font-size:14px;font-weight:600;color:#f4f4f5">Resume downloads (${summary.resumeDownloads} total)</h2><table width="100%" cellpadding="0" cellspacing="0" style="font-size:12px">${resumeRows}</table></td></tr>`
    : "";

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:${bg};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#e4e4e7">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:40px 16px">
<table width="560" cellpadding="0" cellspacing="0" style="background:${surface};border-radius:12px;border:1px solid ${card}">
<tr><td style="padding:32px 32px 12px">
<h1 style="margin:0;font-size:22px;font-weight:600;color:#f4f4f5">damato-data daily</h1>
<p style="margin:8px 0 0;font-size:13px;color:${muted}">${today}</p>
</td></tr>

<tr><td style="padding:16px 32px">
<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td width="32%" style="text-align:center;padding:14px 6px;background:${card};border-radius:8px;vertical-align:top">
<div style="font-size:22px;font-weight:700;color:#f4f4f5">${summary.currentWeekTotals.pageviews}</div>
<div style="font-size:10px;color:${muted};text-transform:uppercase;letter-spacing:0.5px;margin-top:2px">Pageviews · 7d</div>
<div style="font-size:11px;color:${trendColor(pvDelta)};margin-top:4px">${trendArrow(pvDelta)} ${trendLabel(pvDelta)}</div>
</td>
<td width="2%"></td>
<td width="32%" style="text-align:center;padding:14px 6px;background:${card};border-radius:8px;vertical-align:top">
<div style="font-size:22px;font-weight:700;color:#f4f4f5">${summary.currentWeekTotals.clicks}</div>
<div style="font-size:10px;color:${muted};text-transform:uppercase;letter-spacing:0.5px;margin-top:2px">Clicks · 7d</div>
<div style="font-size:11px;color:${trendColor(clickDelta)};margin-top:4px">${trendArrow(clickDelta)} ${trendLabel(clickDelta)}</div>
</td>
<td width="2%"></td>
<td width="32%" style="text-align:center;padding:14px 6px;background:${card};border-radius:8px;vertical-align:top">
<div style="font-size:22px;font-weight:700;color:#f4f4f5">${summary.currentWeekTotals.sessions}</div>
<div style="font-size:10px;color:${muted};text-transform:uppercase;letter-spacing:0.5px;margin-top:2px">Sessions · 7d</div>
<div style="font-size:11px;color:${trendColor(sessionDelta)};margin-top:4px">${trendArrow(sessionDelta)} ${trendLabel(sessionDelta)}</div>
</td>
</tr>
</table>
</td></tr>

<tr><td style="padding:0 32px 8px">
<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td width="33%" style="text-align:center;font-size:12px;color:${muted}">${summary.uniqueCountries} countries</td>
<td width="33%" style="text-align:center;font-size:12px;color:${muted}">${summary.uniqueCities} cities</td>
<td width="33%" style="text-align:center;font-size:12px;color:${muted}">${summary.bounceRatePct}% bounce</td>
</tr>
</table>
</td></tr>

${highlightsBlock}

<tr><td style="padding:0 32px"><hr style="border:none;border-top:1px solid ${card};margin:0"></td></tr>
<tr><td style="padding:16px 32px">
<h2 style="margin:0 0 8px;font-size:14px;font-weight:600;color:#f4f4f5">7-day trend</h2>
<table width="100%" cellpadding="0" cellspacing="0" style="font-size:12px">
<tr><td style="padding:4px 0;color:${muted};width:80px">Pageviews</td><td style="padding:4px 0">${pvSpark}</td></tr>
<tr><td style="padding:4px 0;color:${muted}">Clicks</td><td style="padding:4px 0">${clickSpark}</td></tr>
</table>
</td></tr>

${resumeBlock}

<tr><td style="padding:0 32px"><hr style="border:none;border-top:1px solid ${card};margin:0"></td></tr>
<tr><td style="padding:16px 32px">
<h2 style="margin:0 0 8px;font-size:14px;font-weight:600;color:#f4f4f5">Top pages</h2>
<table width="100%" cellpadding="0" cellspacing="0" style="font-size:12px">
${pathsRows || `<tr><td style='padding:4px 8px;color:${muted}'>No pageviews yet</td></tr>`}
</table>
</td></tr>

<tr><td style="padding:0 32px"><hr style="border:none;border-top:1px solid ${card};margin:0"></td></tr>
<tr><td style="padding:16px 32px">
<h2 style="margin:0 0 8px;font-size:14px;font-weight:600;color:#f4f4f5">Traffic sources</h2>
<table width="100%" cellpadding="0" cellspacing="0" style="font-size:12px">
${refRows || `<tr><td style='padding:4px 8px;color:${muted}'>No external referrers</td></tr>`}
</table>
</td></tr>

<tr><td style="padding:0 32px"><hr style="border:none;border-top:1px solid ${card};margin:0"></td></tr>
<tr><td style="padding:16px 32px">
<h2 style="margin:0 0 8px;font-size:14px;font-weight:600;color:#f4f4f5">Top countries</h2>
<table width="100%" cellpadding="0" cellspacing="0" style="font-size:12px">
${countryRows || `<tr><td style='padding:4px 8px;color:${muted}'>No location data</td></tr>`}
</table>
</td></tr>

<tr><td style="padding:16px 32px 32px;text-align:center;font-size:11px;color:#52525b">
<a href="${dashboardUrl}" style="color:${accent};text-decoration:none;font-weight:500">Full dashboard →</a>
</td></tr>
</table>
</td></tr></table>
</body>
</html>`;
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET?.trim();

  if (!cronSecret) {
    return NextResponse.json({ error: "cron not configured" }, { status: 503 });
  }
  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const summary = await getAnalyticsSummary();
  if (!summary.kvConfigured) {
    return NextResponse.json({ error: "KV not configured" }, { status: 500 });
  }

  const today = new Intl.DateTimeFormat("en-US", {
    timeZone: process.env.NEXT_PUBLIC_SITE_TZ?.trim() || "America/Chicago",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date());

  const resendKey = process.env.RESEND_API_KEY;
  const notifyTo = process.env.NOTIFY_EMAIL_TO;
  const notifyFrom = process.env.NOTIFY_EMAIL_FROM ?? "onboarding@resend.dev";

  if (!resendKey || !notifyTo) {
    return NextResponse.json(
      { error: "Resend or notify email not configured" },
      { status: 500 }
    );
  }

  const pvDelta = summary.weeklyDelta.pageviewsPct;
  const arrow = trendArrow(pvDelta);
  const trendBit =
    pvDelta === null
      ? ""
      : pvDelta === 0
      ? ` (${arrow} flat)`
      : ` (${arrow} ${Math.abs(pvDelta)}% pv)`;

  const { Resend } = await import("resend");
  const resend = new Resend(resendKey);

  await resend.emails.send({
    from: notifyFrom,
    to: notifyTo,
    subject: `damato-data daily — ${dayKey(Date.now())}${trendBit}`,
    html: htmlDigest(summary, analyticsDashboardUrl(), today),
  });

  return NextResponse.json({ ok: true, sent: true });
}
