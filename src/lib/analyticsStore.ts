import {
  dayKey,
  lastNDayKeys,
  formatLocalTime,
  localHour,
  localWeekday,
  WEEKDAY_LABELS,
} from './analyticsTime';

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

export interface ResumeDownloadEvent {
  ts: number;
  href: string | null;
  referrer: string | null;
  referrerSource: string | null;
  country: string | null;
  region: string | null;
  city: string | null;
  path: string | null;
}

export interface WeeklyTotals {
  pageviews: number;
  clicks: number;
  sessions: number;
  resumeDownloads: number;
}

export interface WeeklyDelta {
  pageviewsPct: number | null;
  clicksPct: number | null;
  sessionsPct: number | null;
  resumeDownloadsPct: number | null;
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
  topCountries: Array<{ country: string; count: number; code: string }>;
  topCities: Array<{ city: string; region: string; country: string; count: number; lat?: string; lon?: string }>;
  recent: AnalyticsRecord[];
  countersLast7Days: Array<{ date: string; pageviews: number; clicks: number }>;
  countersPrev7Days: Array<{ date: string; pageviews: number; clicks: number }>;
  referrerSources: Array<{ source: string; count: number }>;
  topEntryPages: Array<{ path: string; count: number }>;
  topExitPages: Array<{ path: string; count: number }>;
  topPairs: Array<{ from: string; to: string; count: number }>;
  topTriples: Array<{ a: string; b: string; c: string; count: number }>;
  resumeDownloads: number;
  recentResumeDownloads: ResumeDownloadEvent[];
  currentWeekTotals: WeeklyTotals;
  prevWeekTotals: WeeklyTotals;
  weeklyDelta: WeeklyDelta;
  dayOfWeekDistribution: Array<{ day: string; count: number }>;
  hourOfDayDistribution: Array<{ hour: number; count: number }>;
  lastEventTs: number | null;
  botEventCount: number;
}

/** Treats in-app navigation referrers as self so they do not dominate “Top referrers”. */
function isLikelySelfReferrer(referrer: string): boolean {
  const canonical = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "") ?? "";
  if (canonical && referrer.includes(canonical)) return true;
  try {
    const { hostname } = new URL(referrer);
    const h = hostname.toLowerCase();
    return h === "localhost" || h === "127.0.0.1" || h === "[::1]" || h === "::1";
  } catch {
    return false;
  }
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

const EMPTY_WEEKLY: WeeklyTotals = { pageviews: 0, clicks: 0, sessions: 0, resumeDownloads: 0 };
const EMPTY_DELTA: WeeklyDelta = {
  pageviewsPct: null,
  clicksPct: null,
  sessionsPct: null,
  resumeDownloadsPct: null,
};

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
  countersPrev7Days: [],
  referrerSources: [],
  topEntryPages: [],
  topExitPages: [],
  topPairs: [],
  topTriples: [],
  resumeDownloads: 0,
  recentResumeDownloads: [],
  currentWeekTotals: { ...EMPTY_WEEKLY },
  prevWeekTotals: { ...EMPTY_WEEKLY },
  weeklyDelta: { ...EMPTY_DELTA },
  dayOfWeekDistribution: WEEKDAY_LABELS.map((day) => ({ day, count: 0 })),
  hourOfDayDistribution: Array.from({ length: 24 }, (_, hour) => ({ hour, count: 0 })),
  lastEventTs: null,
  botEventCount: 0,
};

function pctChange(current: number, prev: number): number | null {
  if (prev === 0) return current === 0 ? 0 : null;
  return Math.round(((current - prev) / prev) * 100);
}

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
  const clicks = human.filter((e) => e.type === 'link_click' || e.type === 'click');

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
      .filter((e) => e.referrer && !isLikelySelfReferrer(e.referrer as string))
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

  const countryCounts = new Map<string, { country: string; count: number; code: string }>();
  for (const e of human) {
    if (!e.country) continue;
    const ex = countryCounts.get(e.country);
    if (ex) ex.count += 1;
    else countryCounts.set(e.country, { country: e.country, count: 1, code: e.country });
  }
  const topCountries = Array.from(countryCounts.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const buckets14 = lastNDayKeys(14, Date.now());
  const counterCmds: string[][] = [];
  for (const d of buckets14) {
    counterCmds.push(['GET', `analytics:counters:pageview:${d}`]);
    counterCmds.push(['GET', `analytics:counters:link_click:${d}`]);
    counterCmds.push(['GET', `analytics:counters:click:${d}`]);
    counterCmds.push(['SCARD', `analytics:sessions:${d}`]);
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

  const dailyCounters = buckets14.map((date, i) => {
    const base = i * 4;
    const linkClicks = parseInt(counters[base + 1] ?? '0', 10) || 0;
    const legacyClicks = parseInt(counters[base + 2] ?? '0', 10) || 0;
    const sessionsRaw = counters[base + 3];
    const sessions =
      typeof sessionsRaw === 'number' ? sessionsRaw : parseInt(sessionsRaw ?? '0', 10) || 0;
    return {
      date,
      pageviews: parseInt(counters[base] ?? '0', 10) || 0,
      clicks: linkClicks + legacyClicks,
      sessions,
    };
  });
  const countersPrev7Days = dailyCounters.slice(0, 7).map(({ date, pageviews, clicks }) => ({ date, pageviews, clicks }));
  const countersLast7Days = dailyCounters.slice(7).map(({ date, pageviews, clicks }) => ({ date, pageviews, clicks }));

  const sumPageviews = (arr: typeof dailyCounters) => arr.reduce((s, d) => s + d.pageviews, 0);
  const sumClicks = (arr: typeof dailyCounters) => arr.reduce((s, d) => s + d.clicks, 0);
  const sumSessions = (arr: typeof dailyCounters) => arr.reduce((s, d) => s + d.sessions, 0);

  const currentWindow = dailyCounters.slice(7);
  const prevWindow = dailyCounters.slice(0, 7);
  const currentWeekStartMs = Date.now() - 7 * 86_400_000;
  const prevWeekStartMs = Date.now() - 14 * 86_400_000;

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

  const resumeClicks = clicks.filter(
    (e) => e.href && e.href.toLowerCase().includes('resume')
  );
  const resumeDownloads = resumeClicks.length;

  const recentResumeDownloads: ResumeDownloadEvent[] = resumeClicks
    .slice()
    .sort((a, b) => (b.receivedAt ?? b.ts) - (a.receivedAt ?? a.ts))
    .slice(0, 10)
    .map((e) => ({
      ts: e.receivedAt ?? e.ts,
      href: e.href,
      referrer: e.referrer,
      referrerSource: e.referrerSource ?? null,
      country: e.country,
      region: e.region,
      city: e.city,
      path: e.path,
    }));

  const resumeDownloadsCurrent = resumeClicks.filter(
    (e) => (e.receivedAt ?? e.ts) >= currentWeekStartMs
  ).length;
  const resumeDownloadsPrev = resumeClicks.filter((e) => {
    const t = e.receivedAt ?? e.ts;
    return t >= prevWeekStartMs && t < currentWeekStartMs;
  }).length;

  const currentWeekTotals: WeeklyTotals = {
    pageviews: sumPageviews(currentWindow),
    clicks: sumClicks(currentWindow),
    sessions: sumSessions(currentWindow),
    resumeDownloads: resumeDownloadsCurrent,
  };
  const prevWeekTotals: WeeklyTotals = {
    pageviews: sumPageviews(prevWindow),
    clicks: sumClicks(prevWindow),
    sessions: sumSessions(prevWindow),
    resumeDownloads: resumeDownloadsPrev,
  };
  const weeklyDelta: WeeklyDelta = {
    pageviewsPct: pctChange(currentWeekTotals.pageviews, prevWeekTotals.pageviews),
    clicksPct: pctChange(currentWeekTotals.clicks, prevWeekTotals.clicks),
    sessionsPct: pctChange(currentWeekTotals.sessions, prevWeekTotals.sessions),
    resumeDownloadsPct: pctChange(currentWeekTotals.resumeDownloads, prevWeekTotals.resumeDownloads),
  };

  const dayOfWeekBuckets = new Array(7).fill(0);
  const hourOfDayBuckets = new Array(24).fill(0);
  for (const e of pageviews) {
    const t = e.receivedAt ?? e.ts;
    if (!t) continue;
    dayOfWeekBuckets[localWeekday(t)] += 1;
    hourOfDayBuckets[localHour(t)] += 1;
  }
  const dayOfWeekDistribution = WEEKDAY_LABELS.map((day, i) => ({ day, count: dayOfWeekBuckets[i] }));
  const hourOfDayDistribution = hourOfDayBuckets.map((count, hour) => ({ hour, count }));

  const lastEventTs = events.length > 0 ? events[0]!.receivedAt ?? events[0]!.ts : null;
  const botEventCount = events.filter((e) => e.bot).length;

  return {
    kvConfigured: true,
    totalEvents: events.length,
    totalPageviews: pageviews.length,
    totalClicks: clicks.length,
    resumeDownloads,
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
    countersPrev7Days,
    referrerSources,
    topEntryPages,
    topExitPages,
    topPairs,
    topTriples,
    recentResumeDownloads,
    currentWeekTotals,
    prevWeekTotals,
    weeklyDelta,
    dayOfWeekDistribution,
    hourOfDayDistribution,
    lastEventTs,
    botEventCount,
  };
}

export function formatTime(ms: number): string {
  return formatLocalTime(ms);
}

/** ISO 3166-1 alpha-2 country code to regional-indicator emoji flag. */
export function countryFlag(code: string | null | undefined): string {
  if (!code) return '';
  const trimmed = code.trim().toUpperCase();
  if (trimmed.length !== 2) return '';
  const A = 0x1f1e6;
  const codePoints = [
    A + (trimmed.charCodeAt(0) - 65),
    A + (trimmed.charCodeAt(1) - 65),
  ];
  if (codePoints.some((cp) => cp < A || cp > A + 25)) return '';
  return String.fromCodePoint(...codePoints);
}

export { dayKey as bucketDate };