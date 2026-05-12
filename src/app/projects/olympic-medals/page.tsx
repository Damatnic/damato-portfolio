"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  Search,
  Trophy,
  Globe,
  Users,
  Flag,
} from "lucide-react";
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
  Gold: "#fbbf24",
  Silver: "#cbd5e1",
  Bronze: "#d97706",
};

const CONTINENT_COLORS: Record<string, string> = {
  Americas: "#38bdf8",
  Asia: "#f472b6",
  Europe: "#a78bfa",
  Oceania: "#34d399",
  Africa: "#fb923c",
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
      { country: string; Gold: number; Silver: number; Bronze: number; total: number }
    >();
    for (const r of filtered) {
      const e =
        byCountry.get(r.country) ?? {
          country: r.country,
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
      <section className="border-b border-slate-800/60 bg-gradient-to-b from-slate-900/40 to-transparent">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-slate-400 transition hover:text-sky-400"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to portfolio
          </Link>

          <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-sky-400">
                Interactive Project Demo
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Olympic Medal Pipeline
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-400">
                1,343 medal records scraped from Olympedia, parsed with
                BeautifulSoup, enriched with continent data, and served as JSON.
                Filter the data below.
              </p>
            </div>
            <a
              href="https://github.com/Damatnic/olympic-medal-etl"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md bg-slate-900/60 px-3 py-1.5 text-sm text-sky-400 ring-1 ring-slate-700/60 transition hover:bg-slate-900 hover:ring-sky-500/40"
            >
              View ETL code on GitHub <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 py-10 space-y-10">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard icon={<Trophy className="h-5 w-5" />} label="Medals" value={stats.medals} accent="text-amber-400" />
          <StatCard icon={<Flag className="h-5 w-5" />} label="Countries" value={stats.countries} accent="text-sky-400" />
          <StatCard icon={<Globe className="h-5 w-5" />} label="Sports" value={stats.sports} accent="text-fuchsia-400" />
          <StatCard icon={<Users className="h-5 w-5" />} label="Athletes" value={stats.athletes} accent="text-emerald-400" />
        </div>

        <div className="rounded-xl bg-slate-900/40 p-5 ring-1 ring-slate-800/80">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <h2 className="text-lg font-semibold">Filters</h2>
            <button
              onClick={resetFilters}
              className="text-xs text-slate-400 transition hover:text-sky-400"
            >
              Reset all
            </button>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

            <FilterGroup label="Medal type">
              <div className="flex flex-wrap gap-1.5">
                {MEDAL_OPTIONS.map((m) => (
                  <Pill key={m} active={medals.includes(m)} onClick={() => toggleMedal(m)}>
                    {m}
                  </Pill>
                ))}
              </div>
            </FilterGroup>

            <FilterGroup label="Search country">
              <div className="relative">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="e.g. Japan"
                  className="w-full rounded-md bg-slate-950/60 py-1.5 pl-8 pr-3 text-sm text-slate-200 ring-1 ring-slate-700/60 placeholder:text-slate-600 focus:outline-none focus:ring-sky-500/40"
                />
              </div>
            </FilterGroup>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          <div className="rounded-xl bg-slate-900/40 p-5 ring-1 ring-slate-800/80 lg:col-span-3">
            <h3 className="text-lg font-semibold">Top 10 Countries</h3>
            <p className="mt-1 text-xs text-slate-500">By total medal count, stacked by medal type.</p>
            <div className="mt-4 h-80">
              {topCountries.length === 0 ? (
                <EmptyState />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topCountries} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="country" tick={{ fill: "#94a3b8", fontSize: 11 }} interval={0} angle={-30} textAnchor="end" height={60} />
                    <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
                    <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "6px" }} labelStyle={{ color: "#e2e8f0" }} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Bar dataKey="Gold" stackId="a" fill={MEDAL_COLORS.Gold} />
                    <Bar dataKey="Silver" stackId="a" fill={MEDAL_COLORS.Silver} />
                    <Bar dataKey="Bronze" stackId="a" fill={MEDAL_COLORS.Bronze} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="rounded-xl bg-slate-900/40 p-5 ring-1 ring-slate-800/80 lg:col-span-2">
            <h3 className="text-lg font-semibold">By Continent</h3>
            <p className="mt-1 text-xs text-slate-500">Distribution of filtered medals.</p>
            <div className="mt-4 h-80">
              {continentBreakdown.length === 0 ? (
                <EmptyState />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={continentBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={2}>
                      {continentBreakdown.map((entry) => (
                        <Cell key={entry.name} fill={CONTINENT_COLORS[entry.name] ?? "#64748b"} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "6px" }} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-slate-900/40 ring-1 ring-slate-800/80">
          <div className="flex flex-wrap items-end justify-between gap-2 p-5">
            <div>
              <h3 className="text-lg font-semibold">All Countries</h3>
              <p className="mt-1 text-xs text-slate-500">
                {allCountryRows.length} {allCountryRows.length === 1 ? "country" : "countries"} in the current filter.
              </p>
            </div>
          </div>
          <div className="max-h-96 overflow-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-slate-900/95 text-xs uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-5 py-2 text-left font-medium">Country</th>
                  <th className="px-3 py-2 text-left font-medium">Continent</th>
                  <th className="px-3 py-2 text-right font-medium">Gold</th>
                  <th className="px-3 py-2 text-right font-medium">Silver</th>
                  <th className="px-3 py-2 text-right font-medium">Bronze</th>
                  <th className="px-5 py-2 text-right font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {allCountryRows.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-8 text-center text-slate-500">
                      No medals match the current filter.
                    </td>
                  </tr>
                ) : (
                  allCountryRows.map((row) => (
                    <tr key={row.country} className="border-t border-slate-800/40 transition hover:bg-slate-900/40">
                      <td className="px-5 py-2 font-medium text-slate-200">{row.country}</td>
                      <td className="px-3 py-2 text-slate-400">{row.continent}</td>
                      <td className="px-3 py-2 text-right text-amber-400">{row.Gold || ""}</td>
                      <td className="px-3 py-2 text-right text-slate-300">{row.Silver || ""}</td>
                      <td className="px-3 py-2 text-right text-amber-700">{row.Bronze || ""}</td>
                      <td className="px-5 py-2 text-right font-semibold text-slate-100">{row.total}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl bg-slate-900/40 p-5 ring-1 ring-slate-800/80 text-sm leading-relaxed text-slate-400">
          <h3 className="text-base font-semibold text-slate-200">How this works</h3>
          <p className="mt-2">
            The data on this page is the same JSON exported by the ETL pipeline. The Python notebook scrapes Tokyo 2020 and Beijing 2022 medal pages from Olympedia, parses them with BeautifulSoup (pandas.read_html didn&apos;t handle the embedded flag image tags), and originally enriched the records by joining against a SQL Server <code className="rounded bg-slate-800/60 px-1 py-0.5 text-xs text-slate-200">World</code> database for continent and capital. For this public demo the continent enrichment is replayed in JavaScript so the dataset works offline.
          </p>
          <p className="mt-3">
            The charts and table above are filtered client-side from the same 1,343-row JSON file. Source for the ETL pipeline lives on{" "}
            <a href="https://github.com/Damatnic/olympic-medal-etl" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:text-sky-300">
              GitHub
            </a>
            .
          </p>
        </div>
      </div>
    </main>
  );
}

function StatCard({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: number; accent: string }) {
  return (
    <div className="rounded-xl bg-slate-900/40 p-5 ring-1 ring-slate-800/80">
      <div className={`flex items-center gap-2 ${accent}`}>
        {icon}
        <span className="font-mono text-xs uppercase tracking-widest">{label}</span>
      </div>
      <p className="mt-3 text-3xl font-bold tracking-tight text-slate-100">{value.toLocaleString()}</p>
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-widest text-slate-400">{label}</p>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={
        "rounded-md px-2.5 py-1 text-xs ring-1 transition " +
        (active
          ? "bg-sky-500/20 text-sky-300 ring-sky-500/40"
          : "bg-slate-900/60 text-slate-400 ring-slate-700/60 hover:text-slate-200 hover:ring-slate-600")
      }
    >
      {children}
    </button>
  );
}

function EmptyState() {
  return (
    <div className="flex h-full items-center justify-center text-sm text-slate-500">
      No data matches the current filter.
    </div>
  );
}
