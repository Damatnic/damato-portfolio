"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface PublicStats {
  kvConfigured: boolean;
  last7Pageviews?: number;
  last7Days?: number[];
  uniqueCountries?: number;
  uniqueSessions?: number;
  resumeDownloads?: number;
}

function Sparkline({ values, ariaLabel }: { values: number[]; ariaLabel: string }) {
  if (values.length === 0) return null;
  const w = 64;
  const h = 18;
  const max = Math.max(1, ...values);
  const step = values.length > 1 ? w / (values.length - 1) : 0;
  const points = values
    .map((v, i) => `${i * step},${h - (v / max) * (h - 2) - 1}`)
    .join(" ");
  return (
    <svg
      role="img"
      aria-label={ariaLabel}
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      className="overflow-visible"
    >
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LiveStats() {
  const [stats, setStats] = useState<PublicStats | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/stats/public")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled) return;
        setStats(data as PublicStats);
      })
      .catch(() => {
        if (!cancelled) setStats(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!stats?.kvConfigured) return null;

  const visits = stats.last7Pageviews ?? 0;
  const sessions = stats.uniqueSessions ?? 0;
  const countries = stats.uniqueCountries ?? 0;
  const resume = stats.resumeDownloads ?? 0;
  const trend = stats.last7Days ?? [];

  return (
    <aside
      className="mt-6 flex flex-wrap items-baseline gap-x-4 gap-y-2 rounded border border-stone-800/60 bg-stone-900/40 px-3 py-2 text-xs text-stone-400 font-mono"
      aria-label="live portfolio analytics"
    >
      <span className="text-stone-500 uppercase tracking-widest text-[10px]">// live</span>

      <span className="flex items-baseline gap-1.5">
        <span className="tabular-nums text-stone-100">{visits.toLocaleString()}</span>
        <span>visits / 7d</span>
        <span className="ml-1 text-emerald-400">
          <Sparkline values={trend} ariaLabel="seven-day pageview trend" />
        </span>
      </span>

      <span className="text-stone-700" aria-hidden="true">·</span>
      <span>
        <span className="tabular-nums text-stone-100">{sessions.toLocaleString()}</span> sessions
      </span>

      <span className="text-stone-700" aria-hidden="true">·</span>
      <span>
        <span className="tabular-nums text-stone-100">{countries}</span>{" "}
        {countries === 1 ? "country" : "countries"}
      </span>

      {resume > 0 && (
        <>
          <span className="text-stone-700" aria-hidden="true">·</span>
          <span>
            <span className="tabular-nums text-stone-100">{resume}</span> resume downloads
          </span>
        </>
      )}

      <Link
        href="/analytics"
        className="ml-auto rounded text-[10px] text-stone-500 underline-offset-4 hover:text-[var(--accent)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-stone-950"
        aria-label="See full public analytics"
      >
        full breakdown →
      </Link>
    </aside>
  );
}
