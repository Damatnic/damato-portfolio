import { dayKey, lastNDayKeys, formatLocalTime } from './analyticsTime';

export interface AnalyticsRecord {
  type: string;
  path: string | null;
  href: string | null;
  label: string | null;
  kind: string | null;
  target: string | null;
  referrer: string | null;
  referrerSource?: 'direct' | 'internal' | 'search' | 'social' | 'other' | null;
  sessionId?: string | null;
  sessionStart?: number | null;
  isFirstPageview?: boolean;
  userAgent: string | null;
  country: string | null;
  region: string | null;
  city: string | null;
  latitude: string | null;
  longitude: string | null;
  timezone: string | null;
  bot: boolean;
  ts: number;
  receivedAt: number;
}

export interface AnalyticsSummary {
  kvConfigured: boolean;
  totalEvents: number;
  totalPageviews: number;
  totalClicks: number;
  uniqueCountries: number;
  uniqueCities: number;
  uniqueSessions: number;
  bouncedSessions: number;
  bounceRatePct: number;
  avgPageviewsPerSession: number;
  avgSessionDurationSec: number;
  topPaths: Array<{ path: string; count: number }>;
  topLinks: Array<{ href: string; label: string; count: number }>;
  topReferrers: Array<{ referrer: string; count: number }>;
  topCountries: Array<{ country: string; count: number }>;
  topCities: Array<{ city: string; region: string; country: string; count: number; lat?: string; lon?: string }>;
  recent: AnalyticsRecord[];
  countersLast7Days: Array<{ date: string; pageviews: number; clicks: number }>;
  referrerSources: Array<{ source: string; count: number }>;
  topEntryPages: Array<{ path: string; count: number }>;
  topExitPages: Array<{ path: string; count: number }>;
  topPairs: Array<{ from: string; to: string; count: number }>;
  topTriples: Array<{ a: string; b: string; c: string; count: number }>;
}

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
      method: 'POST',
      headers: {
        Authorization: `Bearer ${cfg.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cmd),
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { result?: T };
    return data.result ?? null;
  } catch {
    return null;
  }
}

function topN<K extends string | number>(
  items: Array<Record<K, string | number>>,
  key: K,
  n: number
): Array<Record<K, string | number> & { count: number }> {
  const counts = new Map<string, { sample: Record<K, string | number>; count: number }>();
  for (const it of items) {
    const k = String(it[key] ?? '');
    if (!k) continue;
    const existing = counts.get(k);
    if (existing) existing.count += 1;
    else counts.set(k, { sample: it, count: 1 });
  }
  return Array.from(counts.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, n)
    .map((v) => ({ ...v.sample, count: v.count }));
}

const EMPTY_SUMMARY: AnalyticsSummary = {
  kvConfigured: false,
  totalEvents: 0,
  totalPageviews: 0,
  totalClicks: 0,
  uniqueCountries: 0,
  uniqueCities: 0,
  uniqueSessions: 0,
  bouncedSessions: 0,
  bounceRatePct: 0,
  avgPageviewsPerSession: 0,
  avgSessionDurationSec: 0,
  topPaths: [],
  topLinks: [],
  topReferrers: [],
  topCountries: [],
  topCities: [],
  recent: [],
  countersLast7Days: [],
  referrerSources: [],
  topEntryPages: [],
  topExitPages: [],
  topPairs: [],
  topTriples: [],
};

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  const cfg = kvConfig();
  if (!cfg) {
    return EMPTY_SUMMARY;
  }

  const eventStrs = await kvCommand<string[]>(['LRANGE', 'analytics:events', '0', '999']);
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

  const pageviews = human.filter((e) => e.type === 'pageview');
  const clicks = human.filter((e) => e.type === 'link_click');

  const topPaths = topN(
    pageviews.map((e) => ({ path: e.path ?? '/' })),
    'path',
    10
  ) as Array<{ path: string; count: number }>;

  const topLinks = topN(
    clicks.map((e) => ({ href: e.href ?? '', label: e.label ?? '' })),
    'href',
    10
  ) as Array<{ href: string; label: string; count: number }>;

  const topReferrers = topN(
    pageviews
      .filter((e) => e.referrer && !e.referrer.includes(process.env.NEXT_PUBLIC_SITE_URL ?? 'localhost'))
      .map((e) => ({ referrer: e.referrer as string })),
    'referrer',
    10
  ) as Array<{ referrer: string; count: number }>;

  const countries = new Set(human.map((e) => e.country).filter(Boolean));

  const cityCounts = new Map<
    string,
    { city: string; region: string; country: string; count: number; lat?: string; lon?: string }
  >();
  for (const e of human) {
    if (!e.city) continue;
    const key = `${e.country ?? ''}/${e.region ?? ''}/${e.city}`;
    const existing = cityCounts.get(key);
    if (existing) existing.count += 1;
    else
      cityCounts.set(key, {
        city: e.city,
        region: e.region ?? '',
        country: e.country ?? '',
        count: 1,
        lat: e.latitude ?? undefined,
        lon: e.longitude ?? undefined,
      });
  }
  const topCities = Array.from(cityCounts.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const countryCounts = new Map<string, { country: string; count: number }>();
  for (const e of human) {
    if (!e.country) continue;
    const ex = countryCounts.get(e.country);
    if (ex) ex.count += 1;
    else countryCounts.set(e.country, { country: e.country, count: 1 });
  }
  const topCountries = Array.from(countryCounts.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const buckets = lastNDayKeys(7, Date.now());
  const counterCmds: string[][] = [];
  for (const d of buckets) {
    counterCmds.push(['GET', `analytics:counters:pageview:${d}`]);
    counterCmds.push(['GET', `analytics:counters:link_click:${d}`]);
  }
  let counters: Array<string | null> = [];
  try {
    const res = await fetch(`${cfg.url}/pipeline`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${cfg.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(counterCmds),
      cache: 'no-store',
    });
    if (res.ok) {
      const data = (await res.json()) as Array<{ result: string | null }>;
      counters = data.map((c) => c.result);
    }
  } catch {
    /* leave counters empty */
  }

  const countersLast7Days = buckets.map((date, i) => ({
    date,
    pageviews: parseInt(counters[i * 2] ?? '0', 10) || 0,
    clicks: parseInt(counters[i * 2 + 1] ?? '0', 10) || 0,
  }));

  const journeys = new Map<string, AnalyticsRecord[]>();
  for (const e of pageviews) {
    if (!e.sessionId) continue;
    const arr = journeys.get(e.sessionId);
    if (arr) arr.push(e);
    else journeys.set(e.sessionId, [e]);
  }
  for (const arr of journeys.values()) {
    arr.sort((a, b) => a.ts - b.ts);
  }

  const sourceCounts = new Map<string, number>();
  for (const e of pageviews) {
    const src = (e.referrerSource ?? (e.referrer ? 'other' : 'direct')) as string;
    sourceCounts.set(src, (sourceCounts.get(src) ?? 0) + 1);
  }
  const referrerSources = Array.from(sourceCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([source, count]) => ({ source, count }));

  const entryCounts = new Map<string, number>();
  const exitCounts = new Map<string, number>();
  let totalSessionPageviews = 0;
  let totalSessionTimeMs = 0;
  let bouncedSessions = 0;
  let sessionsWithDuration = 0;

  for (const arr of journeys.values()) {
    if (arr.length === 0) continue;
    const first = arr[0]!.path ?? '/';
    const last = arr[arr.length - 1]!.path ?? '/';
    entryCounts.set(first, (entryCounts.get(first) ?? 0) + 1);
    exitCounts.set(last, (exitCounts.get(last) ?? 0) + 1);
    totalSessionPageviews += arr.length;
    
    if (arr.length > 1) {
      const duration = arr[arr.length - 1]!.ts - arr[0]!.ts;
      if (duration > 0 && duration < 3600000) { // filter out sessions > 1hr as likely outliers
        totalSessionTimeMs += duration;
        sessionsWithDuration += 1;
      }
    }
    
    if (arr.length === 1) bouncedSessions += 1;
  }
  const sortByCountDesc = (a: { count: number }, b: { count: number }) =>
    b.count - a.count;
  const topEntryPages = Array.from(entryCounts.entries())
    .map(([path, count]) => ({ path, count }))
    .sort(sortByCountDesc)
    .slice(0, 10);
  const topExitPages = Array.from(exitCounts.entries())
    .map(([path, count]) => ({ path, count }))
    .sort(sortByCountDesc)
    .slice(0, 10);

  const pairCounts = new Map<string, { from: string; to: string; count: number }>();
  const tripleCounts = new Map<
    string,
    { a: string; b: string; c: string; count: number }
  >();
  for (const arr of journeys.values()) {
    const dedup: string[] = [];
    for (const ev of arr) {
      const p = ev.path ?? '/';
      if (dedup[dedup.length - 1] !== p) dedup.push(p);
    }
    for (let i = 0; i + 1 < dedup.length; i++) {
      const from = dedup[i]!;
      const to = dedup[i + 1]!;
      const key = `${from}\t${to}`;
      const ex = pairCounts.get(key);
      if (ex) ex.count += 1;
      else pairCounts.set(key, { from, to, count: 1 });
    }
    for (let i = 0; i + 2 < dedup.length; i++) {
      const a = dedup[i]!;
      const b = dedup[i + 1]!;
      const c = dedup[i + 2]!;
      const key = `${a}\t${b}\t${c}`;
      const ex = tripleCounts.get(key);
      if (ex) ex.count += 1;
      else tripleCounts.set(key, { a, b, c, count: 1 });
    }
  }
  const topPairs = Array.from(pairCounts.values())
    .sort(sortByCountDesc)
    .slice(0, 10);
  const topTriples = Array.from(tripleCounts.values())
    .sort(sortByCountDesc)
    .slice(0, 10);

  const uniqueSessions = journeys.size;
  const bounceRatePct =
    uniqueSessions > 0 ? Math.round((bouncedSessions / uniqueSessions) * 100) : 0;
  const avgPageviewsPerSession =
    uniqueSessions > 0
      ? Math.round((totalSessionPageviews / uniqueSessions) * 10) / 10
      : 0;
  const avgSessionDurationSec =
    sessionsWithDuration > 0
      ? Math.round(totalSessionTimeMs / sessionsWithDuration / 1000)
      : 0;

  return {
    kvConfigured: true,
    totalEvents: events.length,
    totalPageviews: pageviews.length,
    totalClicks: clicks.length,
    uniqueCountries: countries.size,
    uniqueCities: cityCounts.size,
    uniqueSessions,
    bouncedSessions,
    bounceRatePct,
    avgPageviewsPerSession,
    avgSessionDurationSec,
    topPaths,
    topLinks,
    topReferrers,
    topCountries,
    topCities,
    recent: events.slice(0, 50),
    countersLast7Days,
    referrerSources,
    topEntryPages,
    topExitPages,
    topPairs,
    topTriples,
  };
}

export function formatTime(ms: number): string {
  return formatLocalTime(ms);
}

export { dayKey as bucketDate };