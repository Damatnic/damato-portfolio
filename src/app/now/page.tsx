import Link from "next/link";
import { nowEntries } from "@/data/now";

const NOW_DESC = "What I'm working on right now. Dated log, most recent first.";

export const metadata = {
  title: "Now | Nicholas D'Amato",
  description: NOW_DESC,
  alternates: { canonical: "/now" },
  openGraph: {
    title: "Now | Nicholas D'Amato",
    description: NOW_DESC,
    type: "website",
    url: "/now",
  },
  twitter: {
    card: "summary_large_image",
    title: "Now | Nicholas D'Amato",
    description: NOW_DESC,
  },
};

function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  const dt = new Date(Date.UTC(Number(y), Number(m) - 1, Number(d)));
  return dt.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default function NowPage() {
  return (
    <main
      id="main"
      className="mx-auto max-w-3xl px-6 py-12 text-stone-100 selection:bg-[var(--accent)] selection:text-stone-950"
    >
      <header className="mb-10">
        <p className="font-mono text-xs uppercase tracking-widest text-[var(--accent)]">
          {"// dated log · newest first"}
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
          /now
        </h1>
        <p className="mt-5 max-w-[60ch] text-stone-300 leading-relaxed">
          What I&apos;m working on and thinking about. Updated when something
          actually changes, not on a schedule.
        </p>
        <p className="mt-4 text-sm text-stone-400">
          <Link
            href="/"
            className="rounded underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-stone-950"
          >
            ← back to portfolio
          </Link>
        </p>
      </header>

      <ol className="space-y-10">
        {nowEntries.map((entry) => (
          <li key={entry.date} className="border-l border-stone-800 pl-5">
            <time
              dateTime={entry.date}
              className="font-mono text-xs uppercase tracking-widest text-stone-400"
            >
              {formatDate(entry.date)}
            </time>
            <p className="mt-2 text-lg text-stone-100">{entry.summary}</p>
            <ul className="mt-3 space-y-2 text-sm text-stone-300">
              {entry.items.map((it, idx) => (
                <li key={idx} className="flex gap-3 leading-relaxed">
                  <span
                    aria-hidden="true"
                    className="mt-2 inline-block h-px w-3 shrink-0 bg-stone-600"
                  />
                  <span>{it}</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>

      <footer className="mt-14 border-t border-stone-800/60 pt-6 text-xs text-stone-400">
        <p>
          Format inspired by{" "}
          <a
            href="https://nownownow.com/about"
            target="_blank"
            rel="noreferrer"
            className="rounded text-stone-400 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-stone-950"
          >
            nownownow.com
          </a>
          .
        </p>
      </footer>
    </main>
  );
}
