"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import rawData from "@/data/olympic-medals.json";

type Row = {
  olympics: string;
  season: string;
  category: string;
  event: string;
  athlete: string;
  code: string;
  country: string;
  medal: "Gold" | "Silver" | "Bronze";
  continent: string;
};

const ALL_DATA = rawData as Row[];

const MEDAL_COLORS: Record<string, string> = {
  Gold: "#e8b53d",
  Silver: "#a8a29e",
  Bronze: "#a07752",
};

const CONTINENT_COLORS: Record<string, string> = {
  Americas: "#d97757",
  Asia: "#c9886d",
  Europe: "#e8b53d",
  Oceania: "#88a87a",
  Africa: "#a07752",
};

const OLYMPICS_OPTIONS = ["All", "Tokyo 2020", "Beijing 2022"] as const;
const CONTINENT_OPTIONS = [
  "All",
  "Americas",
  "Asia",
  "Europe",
  "Oceania",
  "Africa",
] as const;
const MEDAL_OPTIONS = ["Gold", "Silver", "Bronze"] as const;

export default function OlympicMedalsPage() {
  const [olympics, setOlympics] = useState<string>("All");
  const [continent, setContinent] = useState<string>("All");
  const [medals, setMedals] = useState<string[]>(["Gold", "Silver", "Bronze"]);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return ALL_DATA.filter((r) => {
      if (olympics !== "All" && r.olympics !== olympics) return false;
      if (continent !== "All" && r.continent !== continent) return false;
      if (!medals.includes(r.medal)) return false;
      if (search && !r.country.toLowerCase().includes(search.toLowerCase()))
        return false;
      return true;
    });
  }, [olympics, continent, medals, search]);

  const stats = useMemo(() => {
    const countries = new Set(filtered.map((r) => r.country));
    const sports = new Set(filtered.map((r) => r.category));
    const athletes = new Set(filtered.map((r) => r.athlete));
    return {
      medals: filtered.length,
      countries: countries.size,
      sports: sports.size,
      athletes: athletes.size,
    };
  }, [filtered]);

  const topCountries = useMemo(() => {
    const byCountry = new Map<
      string,
      { country: string; code: string; Gold: number; Silver: number; Bronze: number; total: number }
    >();
    for (const r of filtered) {
      const e =
        byCountry.get(r.country) ?? {
          country: r.country,
          code: r.code,
          Gold: 0,
          Silver: 0,
          Bronze: 0,
          total: 0,
        };
      e[r.medal]++;
      e.total++;
      byCountry.set(r.country, e);
    }
    return Array.from(byCountry.values())
      .sort((a, b) => b.total - a.total || b.Gold - a.Gold)
      .slice(0, 10);
  }, [filtered]);

  const continentBreakdown = useMemo(() => {
    const tally = new Map<string, number>();
    for (const r of filtered) {
      tally.set(r.continent, (tally.get(r.continent) ?? 0) + 1);
    }
    return Array.from(tally.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [filtered]);

  const allCountryRows = useMemo(() => {
    const byCountry = new Map<
      string,
      { country: string; continent: string; Gold: number; Silver: number; Bronze: number; total: number }
    >();
    for (const r of filtered) {
      const e =
        byCountry.get(r.country) ?? {
          country: r.country,
          continent: r.continent,
          Gold: 0,
          Silver: 0,
          Bronze: 0,
          total: 0,
        };
      e[r.medal]++;
      e.total++;
      byCountry.set(r.country, e);
    }
    return Array.from(byCountry.values()).sort(
      (a, b) => b.total - a.total || b.Gold - a.Gold,
    );
  }, [filtered]);

  function toggleMedal(m: string) {
    setMedals((prev) =>
      prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m],
    );
  }

  function resetFilters() {
    setOlympics("All");
    setContinent("All");
    setMedals(["Gold", "Silver", "Bronze"]);
    setSearch("");
  }

  return (
    <main className="flex-1">
      <section className="border-b border-stone-800/60">
        <div className="mx-auto max-w-5xl px-6 pt-10 pb-10">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-[var(--accent)]"
          >
            <ArrowLeft className="h-4 w-4" />
            back
          </Link>

          <h1 className="mt-6 text-3xl font-semibold tracking-tight text-stone-50 sm:text-4xl">
            Olympic Medal Pipeline
          </h1>
          <p className="mt-3 max-w-2xl leading-relaxed text-stone-400">
            1,343 medal records, scraped from Olympedia with BeautifulSoup,
            enriched with continent data, served as JSON, filtered in your
            browser. The same dataset the Python ETL produces.
          </p>
          <p className="mt-2 text-sm">
            <a
              href="https://github.com/Damatnic/olympic-medal-etl"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent)] hover:underline underline-offset-4"
            >
              ETL source on GitHub →
            </a>
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-6 py-12 space-y-12">
        {/* Stats row: one dominant + three secondary */}
        <div className="grid items-end gap-8 border-b border-stone-800/60 pb-10 sm:grid-cols-[auto_1fr]">
          <div>
            <p className="font-mono text-xs text-stone-500">medals in view</p>
            <p className="mt-1 text-6xl font-semibold tracking-tight text-[var(--accent)] sm:text-7xl">
              {stats.medals.toLocaleString()}
            </p>
          </div>
          <dl className="grid grid-cols-3 gap-6 text-sm">
            <div>
              <dt className="text-stone-500">countries</dt>
              <dd className="mt-1 text-2xl font-medium text-stone-100">
                {stats.countries}
              </dd>
            </div>
            <div>
              <dt className="text-stone-500">sports</dt>
              <dd className="mt-1 text-2xl font-medium text-stone-100">
                {stats.sports}
              </dd>
            </div>
            <div>
              <dt className="text-stone-500">athletes</dt>
              <dd className="mt-1 text-2xl font-medium text-stone-100">
                {stats.athletes}
              </dd>
            </div>
          </dl>
        </div>

        {/* Filters */}
        <div>
          <div className="flex items-baseline justify-between">
            <h2 className="text-lg font-medium text-stone-100">Filter the data</h2>
            <button
              onClick={resetFilters}
              className="text-xs text-stone-500 hover:text-[var(--accent)]"
            >
              reset
            </button>
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <FilterGroup label="Olympics">
              <div className="flex flex-wrap gap-1.5">
                {OLYMPICS_OPTIONS.map((o) => (
                  <Pill key={o} active={olympics === o} onClick={() => setOlympics(o)}>
                    {o}
                  </Pill>
                ))}
              </div>
            </FilterGroup>

            <FilterGroup label="Continent">
              <div className="flex flex-wrap gap-1.5">
                {CONTINENT_OPTIONS.map((c) => (
                  <Pill key={c} active={continent === c} onClick={() => setContinent(c)}>
                    {c}
                  </Pill>
                ))}
              </div>
            </FilterGroup>

            <FilterGroup label="Medal">
              <div className="flex flex-wrap gap-1.5">
                {MEDAL_OPTIONS.map((m) => (
                  <Pill key={m} active={medals.includes(m)} onClick={() => toggleMedal(m)}>
                    {m}
                  </Pill>
                ))}
              </div>
            </FilterGroup>

            <FilterGroup label="Country">
              <div className="relative">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-600" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="e.g. Japan"
                  className="w-full rounded border border-stone-800 bg-stone-950 py-1.5 pl-8 pr-3 text-sm text-stone-200 placeholder:text-stone-600 focus:border-[var(--accent)] focus:outline-none"
                />
              </div>
            </FilterGroup>
          </div>
        </div>

        {/* Charts */}
        <div className="grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <h3 className="text-base font-medium text-stone-100">Top 10 countries</h3>
            <p className="mt-1 text-xs text-stone-500">Stacked by medal type.</p>
            <div className="mt-5 h-80">
              {topCountries.length === 0 ? (
                <EmptyState />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topCountries} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="2 4" stroke="#292524" vertical={false} />
                    <XAxis dataKey="code" tick={{ fill: "#d6d3d1", fontSize: 12, fontFamily: "ui-monospace, monospace" }} interval={0} tickLine={false} axisLine={{ stroke: "#44403c" }} />
                    <YAxis tick={{ fill: "#a8a29e", fontSize: 11 }} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#1c1917", border: "1px solid #44403c", borderRadius: "4px" }}
                      labelStyle={{ color: "#f5f5f4" }}
                      labelFormatter={(label, payload) => {
                        const item = (payload as ReadonlyArray<{ payload?: { country?: string } }> | undefined)?.[0]?.payload;
                        return item?.country ? `${item.country} (${String(label)})` : String(label ?? "");
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} iconType="circle" />
                    <Bar dataKey="Gold" stackId="a" fill={MEDAL_COLORS.Gold} />
                    <Bar dataKey="Silver" stackId="a" fill={MEDAL_COLORS.Silver} />
                    <Bar dataKey="Bronze" stackId="a" fill={MEDAL_COLORS.Bronze} radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-base font-medium text-stone-100">By continent</h3>
            <p className="mt-1 text-xs text-stone-500">Share of filtered medals.</p>
            <div className="mt-5 h-80">
              {continentBreakdown.length === 0 ? (
                <EmptyState />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={continentBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={95} paddingAngle={1}>
                      {continentBreakdown.map((entry) => (
                        <Cell key={entry.name} fill={CONTINENT_COLORS[entry.name] ?? "#57534e"} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: "#1c1917", border: "1px solid #44403c", borderRadius: "4px" }} />
                    <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        {/* Country table */}
        <div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-base font-medium text-stone-100">All countries</h3>
            <p className="text-xs text-stone-500">
              {allCountryRows.length} {allCountryRows.length === 1 ? "country" : "countries"} in view
            </p>
          </div>
          <div className="mt-5 max-h-96 overflow-auto border-t border-b border-stone-800/60">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-stone-950 text-xs text-stone-500">
                <tr className="border-b border-stone-800">
                  <th className="px-2 py-2 text-left font-normal">country</th>
                  <th className="px-2 py-2 text-left font-normal">continent</th>
                  <th className="px-2 py-2 text-right font-normal">gold</th>
                  <th className="px-2 py-2 text-right font-normal">silver</th>
                  <th className="px-2 py-2 text-right font-normal">bronze</th>
                  <th className="px-2 py-2 text-right font-normal">total</th>
                </tr>
              </thead>
              <tbody>
                {allCountryRows.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-2 py-8 text-center text-stone-500">
                      No medals match the current filter.
                    </td>
                  </tr>
                ) : (
                  allCountryRows.map((row) => (
                    <tr key={row.country} className="border-b border-stone-900 hover:bg-stone-900/40">
                      <td className="px-2 py-2 text-stone-200">{row.country}</td>
                      <td className="px-2 py-2 text-stone-500">{row.continent}</td>
                      <td className="px-2 py-2 text-right text-[var(--accent)]">{row.Gold || ""}</td>
                      <td className="px-2 py-2 text-right text-stone-400">{row.Silver || ""}</td>
                      <td className="px-2 py-2 text-right text-stone-500">{row.Bronze || ""}</td>
                      <td className="px-2 py-2 text-right font-medium text-stone-100">{row.total}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* How it works */}
        <div className="border-t border-stone-800/60 pt-10 text-sm leading-relaxed text-stone-400">
          <h3 className="text-base font-medium text-stone-100">How this works</h3>
          <p className="mt-3">
            The data on this page is the same JSON the ETL produces. The Python
            notebook scrapes the Tokyo 2020 and Beijing 2022 medal pages from
            Olympedia, parses them with BeautifulSoup (pandas.read_html choked
            on embedded flag image tags), and originally enriched the records
            by joining against a SQL Server <code className="rounded bg-stone-900 px-1 py-0.5 text-xs text-stone-200">World</code> database for continent and capital. For this
            public demo the continent enrichment is replayed in JavaScript so
            it works without DB access.
          </p>
          <p className="mt-3">
            The charts and table are filtered client-side from the same
            1,343-row file. ETL source lives on{" "}
            <a href="https://github.com/Damatnic/olympic-medal-etl" target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] hover:underline underline-offset-4">
              GitHub
            </a>
            .
          </p>
        </div>
      </div>
    </main>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs text-stone-500">{label}</p>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={
        "rounded border px-2.5 py-1 text-xs transition " +
        (active
          ? "border-[var(--accent)]/50 bg-[var(--accent-soft)] text-[var(--accent)]"
          : "border-stone-800 bg-stone-950 text-stone-400 hover:border-stone-700 hover:text-stone-200")
      }
    >
      {children}
    </button>
  );
}

function EmptyState() {
  return (
    <div className="flex h-full items-center justify-center text-sm text-stone-500">
      No data matches the current filter.
    </div>
  );
}
