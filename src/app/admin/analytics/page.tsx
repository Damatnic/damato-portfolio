import { getAnalyticsSummary, formatTime } from "@/lib/analyticsStore";
import { timingSafeEqual } from "node:crypto";

export const dynamic = "force-dynamic";

function secretsMatch(provided: string | undefined, expected: string): boolean {
  if (!provided) return false;
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export const metadata = {
  title: "Analytics · damato-data",
  description: "Site traffic and link-click analytics",
};

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-stone-800 bg-stone-900/50 p-4">
      <p className="text-xs uppercase tracking-wide text-stone-400">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-stone-100">{value}</p>
    </div>
  );
}

function TableCard({ title, headers, rows, cols }: {
  title: string;
  headers: string[];
  rows: Record<string, string | number>[][];
  cols: string[];
}) {
  return (
    <div className="rounded border border-stone-800 bg-stone-900/50 p-4">
      <h3 className="mb-3 text-sm font-semibold text-stone-200">{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-stone-400">
          <thead>
            <tr className="border-b border-stone-800">
              {headers.map((h, i) => (
                <th key={i} scope="col" className="pb-2 pr-4 font-medium uppercase tracking-wider text-stone-400">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => {
              const cell = Object.assign({}, ...row) as Record<string, string | number>;
              return (
                <tr key={ri} className="border-b border-stone-800/50 last:border-0">
                  {cols.map((col) => (
                    <td key={col} className="py-2 pr-4 text-stone-300">
                      {typeof cell[col] === "number" ? cell[col].toLocaleString() : (cell[col] ?? "")}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ReferrerTable({ title, rows }: {
  title: string;
  rows: { source: string; count: number }[];
}) {
  return (
    <div className="rounded border border-stone-800 bg-stone-900/50 p-4">
      <h3 className="mb-3 text-sm font-semibold text-stone-200">{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-stone-400">
          <thead>
            <tr className="border-b border-stone-800">
              <th scope="col" className="pb-2 pr-4 font-medium uppercase tracking-wider text-stone-400">Source</th>
              <th scope="col" className="pb-2 pr-4 font-medium uppercase tracking-wider text-stone-400">Count</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b border-stone-800/50 last:border-0">
                <td className="py-2 pr-4 text-stone-300">{r.source}</td>
                <td className="py-2 pr-4 text-stone-300">{r.count.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function EventsTable({ title, events }: { title: string; events: { type?: string; path?: string | null; href?: string | null; country?: string | null; city?: string | null; ts?: number; receivedAt?: number; bot?: boolean }[] }) {
  return (
    <div className="rounded border border-stone-800 bg-stone-900/50 p-4">
      <h3 className="mb-3 text-sm font-semibold text-stone-200">{title}</h3>
      <div className="max-h-96 overflow-y-auto">
        <table className="w-full text-left text-xs text-stone-400">
          <thead className="sticky top-0 bg-stone-900">
            <tr className="border-b border-stone-800">
              <th scope="col" className="pb-2 pr-3 font-medium text-stone-400">Time</th>
              <th scope="col" className="pb-2 pr-3 font-medium text-stone-400">Type</th>
              <th scope="col" className="pb-2 pr-3 font-medium text-stone-400">Path</th>
              <th scope="col" className="pb-2 pr-3 font-medium text-stone-400">Location</th>
              <th scope="col" className="pb-2 font-medium text-stone-400">Bot</th>
            </tr>
          </thead>
          <tbody>
            {events.map((e, i) => (
              <tr key={i} className="border-b border-stone-800/50 last:border-0">
                <td className="py-1.5 pr-3 text-stone-500 whitespace-nowrap">{formatTime(e.receivedAt ?? e.ts ?? 0)}</td>
                <td className="py-1.5 pr-3 text-stone-300">{e.type}</td>
                <td className="py-1.5 pr-3 text-stone-300 max-w-[200px] truncate">{e.path ?? e.href ?? "—"}</td>
                <td className="py-1.5 pr-3 text-stone-500">{[e.city, e.country].filter(Boolean).join(", ") || "—"}</td>
                <td className="py-1.5 text-stone-500">{e.bot ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ secret?: string }>;
}) {
  const params = await searchParams;
  const allowedSecret = process.env.ANALYTICS_SECRET?.trim();
  if (!allowedSecret || !secretsMatch(params.secret, allowedSecret)) {
    return (
      <main id="main" className="mx-auto max-w-3xl px-6 py-16 text-stone-100">
        <h1 className="mb-4 text-2xl font-semibold">Not authorized</h1>
        <p className="text-stone-400">
          Set <code className="rounded bg-stone-800 px-1 py-0.5 text-sm text-stone-300">ANALYTICS_SECRET</code> as a
          Vercel environment variable, then visit{" "}
          <code className="rounded bg-stone-800 px-1 py-0.5 text-sm text-stone-300">
            /admin/analytics?secret=your-secret
          </code>
        </p>
      </main>
    );
  }

  const summary = await getAnalyticsSummary();

  if (!summary.kvConfigured) {
    return (
      <main id="main" className="mx-auto max-w-3xl px-6 py-16 text-stone-100">
        <h1 className="mb-4 text-3xl font-semibold">Analytics</h1>
        <div className="rounded-lg border border-stone-800 bg-stone-900/40 p-6">
          <h2 className="mb-2 text-xl font-semibold">Storage not configured</h2>
          <p className="mb-3 text-stone-400">
            Events are streaming to Vercel runtime logs and the Vercel Analytics dashboard.
            To populate this page with charts and tables, add a Vercel KV (Upstash Redis)
            integration to the project.
          </p>
          <ol className="ml-5 list-decimal space-y-1 text-stone-400">
            <li>Open the project on Vercel: <a href="https://vercel.com/dashboard" className="text-[var(--accent)] underline underline-offset-4" target="_blank" rel="noreferrer">vercel.com/dashboard</a></li>
            <li>Storage → Connect Database → Marketplace → <strong>Upstash KV</strong></li>
            <li>Click Create. Vercel auto-injects the KV env vars. Redeploy.</li>
          </ol>
        </div>
      </main>
    );
  }

  const dayData = summary.countersLast7Days;

  return (
    <main id="main" className="mx-auto max-w-6xl px-6 py-12 text-stone-100">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Analytics</h1>
        <p className="mt-1 text-sm text-stone-300">
          Live site activity. Bot traffic excluded from rankings; total events includes everything.
        </p>
      </header>

      <section className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
        <Stat label="Total events" value={summary.totalEvents.toLocaleString()} />
        <Stat label="Pageviews (sample)" value={summary.totalPageviews.toLocaleString()} />
        <Stat label="Link clicks (sample)" value={summary.totalClicks.toLocaleString()} />
        <Stat label="Resume downloads" value={summary.resumeDownloads.toLocaleString()} />
        <Stat label="Countries" value={summary.uniqueCountries.toLocaleString()} />
        <Stat label="Cities" value={summary.uniqueCities.toLocaleString()} />
      </section>

      <section className="mb-10 grid grid-cols-2 gap-3 md:grid-cols-5">
        <Stat label="Sessions" value={summary.uniqueSessions.toLocaleString()} />
        <Stat label="Avg pages / session" value={summary.avgPageviewsPerSession.toString()} />
        <Stat label="Avg session duration" value={`${Math.floor(summary.avgSessionDurationSec / 60)}m ${summary.avgSessionDurationSec % 60}s`} />
        <Stat label="Bounce rate" value={`${summary.bounceRatePct}%`} />
        <Stat label="Bounced sessions" value={summary.bouncedSessions.toLocaleString()} />
      </section>

      {dayData.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-stone-200">Last 7 days</h2>
            <div className="flex items-center gap-4 text-[10px] text-stone-500">
              <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-2 rounded-sm bg-[var(--accent)]" /> pageviews</span>
              <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-2 rounded-sm bg-stone-600" /> clicks</span>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {(() => {
              const max = Math.max(...dayData.map((x) => Math.max(x.pageviews, x.clicks)), 1);
              const barH = (val: number) => `${Math.max((val / max) * 80, 2)}px`;
              return dayData.map((d) => (
                <div key={d.date} className="flex flex-col items-center gap-1 rounded border border-stone-800 bg-stone-900/50 p-3">
                  <span className="text-[10px] text-stone-500">{d.date.slice(5)}</span>
                  <div className="flex items-end gap-1" style={{ height: "80px" }}>
                    <div className="w-3 rounded-t bg-[var(--accent)]" style={{ height: barH(d.pageviews) }} title={`${d.pageviews} pageviews`} />
                    <div className="w-3 rounded-t bg-stone-600" style={{ height: barH(d.clicks) }} title={`${d.clicks} clicks`} />
                  </div>
                  <div className="flex gap-2 text-[10px] text-stone-500">
                    <span>{d.pageviews}</span>
                    <span>{d.clicks}</span>
                  </div>
                </div>
              ));
            })()}
          </div>
        </section>
      )}

      <section className="mb-10 grid gap-4 md:grid-cols-2">
        <TableCard title="Top paths" headers={["Path", "Views"]} rows={summary.topPaths.map((p) => [{ path: p.path, count: p.count }])} cols={["path", "count"]} />
        <TableCard title="Top links clicked" headers={["Link", "Label", "Clicks"]} rows={summary.topLinks.map((l) => [{ href: l.href, label: l.label, count: l.count }])} cols={["href", "label", "count"]} />
      </section>

      <section className="mb-10 grid gap-4 md:grid-cols-2">
        <TableCard title="Top referrers" headers={["Referrer", "Count"]} rows={summary.topReferrers.map((r) => [{ referrer: r.referrer, count: r.count }])} cols={["referrer", "count"]} />
        <ReferrerTable title="Traffic sources" rows={summary.referrerSources} />
      </section>

      <section className="mb-10 grid gap-4 md:grid-cols-2">
        <TableCard title="Top countries" headers={["Country", "Count"]} rows={summary.topCountries.map((c) => [{ country: c.country, count: c.count }])} cols={["country", "count"]} />
        <TableCard title="Top cities" headers={["City", "Region", "Country", "Count"]} rows={summary.topCities.map((c) => [{ city: c.city, region: c.region, country: c.country, count: c.count }])} cols={["city", "region", "country", "count"]} />
      </section>

      <section className="mb-10 grid gap-4 md:grid-cols-2">
        <TableCard title="Top entry pages" headers={["Path", "Count"]} rows={summary.topEntryPages.map((p) => [{ path: p.path, count: p.count }])} cols={["path", "count"]} />
        <TableCard title="Top exit pages" headers={["Path", "Count"]} rows={summary.topExitPages.map((p) => [{ path: p.path, count: p.count }])} cols={["path", "count"]} />
      </section>

      <section className="mb-10 grid gap-4 md:grid-cols-2">
        <TableCard title="Top path pairs" headers={["From", "To", "Count"]} rows={summary.topPairs.map((p) => [{ from: p.from, to: p.to, count: p.count }])} cols={["from", "to", "count"]} />
        <TableCard title="Top path triples" headers={["A", "B", "C", "Count"]} rows={summary.topTriples.map((t) => [{ a: t.a, b: t.b, c: t.c, count: t.count }])} cols={["a", "b", "c", "count"]} />
      </section>

      <EventsTable title="Recent events" events={summary.recent} />
    </main>
  );
}
