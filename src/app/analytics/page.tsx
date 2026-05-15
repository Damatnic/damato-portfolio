import Link from "next/link";
import { getAnalyticsSummary } from "@/lib/analyticsStore";
import { PublicAnalyticsChart } from "@/components/PublicAnalyticsChart";

export const dynamic = "force-dynamic";
export const revalidate = 60;

export const metadata = {
  title: "Analytics · damato-data",
  description:
    "Public read-only view of this portfolio's own traffic. PII-stripped. Updated live.",
};

function refererHost(url: string): string | null {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded border border-stone-800 bg-stone-900/40 p-4">
      <p className="text-[10px] uppercase tracking-widest text-stone-500">{label}</p>
      <p className="mt-1.5 text-2xl font-semibold tabular-nums text-stone-100">{value}</p>
      {sub && <p className="mt-0.5 text-[11px] text-stone-500">{sub}</p>}
    </div>
  );
}

export default async function PublicAnalyticsPage() {
  const summary = await getAnalyticsSummary();

  if (!summary.kvConfigured) {
    return (
      <main id="main" className="mx-auto max-w-3xl px-6 py-16 text-stone-100">
        <h1 className="text-3xl font-semibold">/analytics</h1>
        <p className="mt-4 text-stone-300">
          Storage isn&apos;t configured yet. Once Vercel KV is connected, this
          page populates automatically.
        </p>
      </main>
    );
  }

  const last14 = [...summary.countersPrev7Days, ...summary.countersLast7Days];

  const hostCounts = new Map<string, number>();
  for (const r of summary.topReferrers) {
    const host = refererHost(r.referrer);
    if (!host) continue;
    hostCounts.set(host, (hostCounts.get(host) ?? 0) + r.count);
  }
  const topHosts = Array.from(hostCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const topPages = summary.topPaths.slice(0, 5);

  const hourMax = Math.max(...summary.hourOfDayDistribution.map((h) => h.count), 1);

  return (
    <main
      id="main"
      className="mx-auto max-w-5xl px-6 py-12 text-stone-100 selection:bg-[var(--accent)] selection:text-stone-950"
    >
      <header className="mb-10">
        <p className="font-mono text-xs uppercase tracking-widest text-[var(--accent)]">
          // live · pii-stripped · auto-updates every minute
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
          /analytics
        </h1>
        <p className="mt-5 max-w-[68ch] text-stone-300 leading-relaxed">
          Most data portfolios hide their analytics. Mine doesn&apos;t. This is a
          live read of the same KV store the private dashboard uses, with every
          field that could identify a visitor stripped out. No IPs, no user
          agents, no session ids, no referrer paths, no cities. Just the
          counters and the shape of the traffic. The whole pipeline (track API,
          KV writes, daily digest email, this page) is in the same repo.
        </p>
        <p className="mt-4 text-sm text-stone-500">
          <Link href="/" className="underline-offset-4 hover:underline">
            ← back to portfolio
          </Link>
        </p>
      </header>

      <section className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard
          label="pageviews (7d)"
          value={summary.currentWeekTotals.pageviews.toLocaleString()}
          sub={
            summary.weeklyDelta.pageviewsPct === null
              ? "no prior data"
              : `${summary.weeklyDelta.pageviewsPct >= 0 ? "+" : ""}${summary.weeklyDelta.pageviewsPct}% vs prev 7d`
          }
        />
        <StatCard
          label="sessions (7d)"
          value={summary.currentWeekTotals.sessions.toLocaleString()}
        />
        <StatCard
          label="link clicks (7d)"
          value={summary.currentWeekTotals.clicks.toLocaleString()}
        />
        <StatCard
          label="resume downloads"
          value={summary.resumeDownloads.toLocaleString()}
          sub="all-time"
        />
        <StatCard
          label="countries"
          value={summary.uniqueCountries.toLocaleString()}
        />
        <StatCard label="bounce rate" value={`${summary.bounceRatePct}%`} />
      </section>

      <section className="mb-10 rounded border border-stone-800 bg-stone-900/40 p-5">
        <div className="mb-2 flex items-baseline justify-between">
          <h2 className="text-sm font-semibold text-stone-200">
            last 14 days · pageviews and link clicks
          </h2>
          <span className="font-mono text-[10px] uppercase tracking-widest text-stone-500">
            counters from kv
          </span>
        </div>
        <PublicAnalyticsChart data={last14} />
      </section>

      <section className="mb-10 grid gap-4 md:grid-cols-2">
        <div className="rounded border border-stone-800 bg-stone-900/40 p-5">
          <h2 className="mb-3 text-sm font-semibold text-stone-200">
            top referrer hosts
          </h2>
          {topHosts.length === 0 ? (
            <p className="text-xs text-stone-500">
              No external referrers in window. Most visits are direct.
            </p>
          ) : (
            <ul className="space-y-1.5 font-mono text-xs">
              {topHosts.map(([host, n]) => (
                <li key={host} className="flex items-center justify-between">
                  <span className="text-stone-200">{host}</span>
                  <span className="text-stone-500">{n}</span>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-3 text-[10px] text-stone-500">
            Hostnames only. Paths from the referring site are dropped.
          </p>
        </div>

        <div className="rounded border border-stone-800 bg-stone-900/40 p-5">
          <h2 className="mb-3 text-sm font-semibold text-stone-200">
            top pages on this site
          </h2>
          <ul className="space-y-1.5 font-mono text-xs">
            {topPages.map((p) => (
              <li key={p.path} className="flex items-center justify-between gap-3">
                <span className="truncate text-stone-200">{p.path}</span>
                <span className="text-stone-500">{p.count.toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mb-10 rounded border border-stone-800 bg-stone-900/40 p-5">
        <h2 className="mb-3 text-sm font-semibold text-stone-200">
          when people visit (central time)
        </h2>
        <div className="flex items-end gap-[3px]" style={{ height: 72 }}>
          {summary.hourOfDayDistribution.map((h) => (
            <div
              key={h.hour}
              className="flex-1 rounded-t bg-[var(--accent)]/80"
              style={{
                height: `${Math.max((h.count / hourMax) * 64, 2)}px`,
              }}
              title={`${h.hour}:00 — ${h.count}`}
            />
          ))}
        </div>
        <div className="mt-1 flex justify-between font-mono text-[10px] text-stone-500">
          <span>12a</span>
          <span>6a</span>
          <span>12p</span>
          <span>6p</span>
          <span>12a</span>
        </div>
      </section>

      <footer className="border-t border-stone-800/60 pt-6 text-xs text-stone-500">
        <p className="leading-relaxed">
          What&apos;s shown above: aggregate counters, hostnames of referring
          sites, paths on this site, country count, hour-of-day distribution.
          What&apos;s never shown: IP, user agent, session id, referrer paths,
          city or region, resume-download event details, individual events.
          Source:{" "}
          <a
            href="https://github.com/Damatnic/damato-portfolio/blob/main/src/lib/analyticsStore.ts"
            target="_blank"
            rel="noreferrer"
            className="text-stone-400 underline-offset-4 hover:underline"
          >
            analyticsStore.ts
          </a>
          ,{" "}
          <a
            href="https://github.com/Damatnic/damato-portfolio/blob/main/src/app/analytics/page.tsx"
            target="_blank"
            rel="noreferrer"
            className="text-stone-400 underline-offset-4 hover:underline"
          >
            this page
          </a>
          .
        </p>
      </footer>
    </main>
  );
}
