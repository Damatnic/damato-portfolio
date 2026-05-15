export interface NowEntry {
  date: string;
  summary: string;
  items: string[];
}

export const nowEntries: NowEntry[] = [
  {
    date: "2026-05-14",
    summary: "A-grade push across all three sites.",
    items: [
      "Built the analytics pipeline end to end: KV event store, PII-stripping, daily digest email. Kept it private (gated dashboard, not a public vanity counter).",
      "damato-sql: hint-free capstone challenges at the end of modules 4, 6, and 9. Anti-pattern teaching with EXPLAIN QUERY PLAN diffs on the six highest-traffic lessons.",
      "damato-python: real pyfetch in module 6 lessons 27 through 30 (no more inline strings). New NumPy module. Open-ended capstone replaces the heavily scaffolded one.",
      "Cross-module callbacks linking GROUP BY to DataFrame.groupby, JOINs to pd.merge, window functions to rolling.",
    ],
  },
  {
    date: "2026-05-09",
    summary: "Side project rewrites, rank ladders, analytics wiring.",
    items: [
      "Wired the site analytics through to a private dashboard instead of a public counter.",
      "Reframed the side project copy from \"tools I made while learning\" to \"couldn't find X, built it.\" damato-sql and damato-python read like real shipped projects now.",
      "Rank ladder on both mastery sites is now competency-named (data analyst, query architect, pipeline operator) with one-line blurbs instead of \"architect → master.\"",
      "Project thread banner on damato-sql so the multi-lesson narrative is visible from inside any thread step.",
    ],
  },
  {
    date: "2026-05-02",
    summary: "Spaced repetition, search, cheatsheet expansion.",
    items: [
      "review command in the home terminal on both mastery sites. Picks an old completed lesson; tracks reviewedAt separately from completed so retention surfaces in /stats.",
      "search <keyword> command. Indexes lesson titles and theory at module load. Cuts \"how do I LEFT join\" from three clicks to one.",
      "Expanded damato-sql cheatsheet beyond subqueries to cover window functions, CTEs, CASE, correlated subqueries.",
      "Added pd.to_datetime / strftime / dt accessor lesson to damato-python module 3 to close the date-handling gap.",
    ],
  },
  {
    date: "2026-04-25",
    summary: "Voice and reliability pass.",
    items: [
      "Em-dash sweep across every lesson on both mastery sites. They were creeping back in and reading AI-shaped.",
      "Watchdog + error boundary around the Pyodide worker so a runaway pandas op doesn't freeze the page.",
      "Validator surfacing so a failed challenge actually says what the expected output looked like, not just \"wrong.\"",
      "Idempotency on the track endpoint so a double-fire from rapid clicks doesn't double-count.",
    ],
  },
  {
    date: "2026-04-18",
    summary: "Pyodide in a worker, terminal aesthetic everywhere.",
    items: [
      "Moved Pyodide out of the main thread and into a Web Worker on damato-python. Real infinite-loop kill: a misplaced while True now gets terminated, not a frozen tab.",
      "Terminal aesthetic across all lesson pages, project pages, and the playground on both mastery sites. Monospace, terminal-style prompts, no glow chrome.",
      "Reframed both sites away from \"learning product\" toward \"personal training tool I happen to be sharing.\" The copy reads truer.",
    ],
  },
];
