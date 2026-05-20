export interface NowEntry {
  date: string;
  summary: string;
  items: string[];
}

export const nowEntries: NowEntry[] = [
  {
    date: "2026-05-20",
    summary: "Finishing the semester, deep in window functions.",
    items: [
      "Window functions finally clicked after I stopped trying to think of them like GROUP BY. LAG and LEAD are straightforward but I kept getting tripped up on when PARTITION BY changes the row count vs when it doesn't. Drew it out on paper, that helped.",
      "Still not sure exactly when to reach for numpy instead of pandas for number stuff. Everyone says 'performance' but I haven't hit a case where pandas was actually too slow. Probably just haven't worked with enough data yet.",
      "Looking for part-time analyst work or an internship in the Milwaukee area while I finish the degree.",
    ],
  },
  {
    date: "2026-04-15",
    summary: "Power BI project done, DAX is a different kind of hard.",
    items: [
      "Wrapped up the Power BI dashboard for class, it's in the portfolio. Star schema came together pretty naturally after the SQL work but DAX filter context kept biting me. CALCULATE makes sense now but it took a while to stop thinking about it like a WHERE clause.",
      "Started taking the numpy side of things more seriously. pandas wraps most of it but there's stuff you can only do when you go one level down and I keep running into the edges.",
    ],
  },
  {
    date: "2026-03-01",
    summary: "SQL Server schema project wrapped. Triggers are more involved than I expected.",
    items: [
      "Finished the car rental database for the SQL Server course. The partitioning and audit triggers were new to me. Triggers specifically, there's a lot of 'okay but what actually fires when and in what order' that isn't obvious until you break something.",
      "Started spending more time on the data side of things and less on the networking/IT side. The AD and ServiceNow background is useful context but it's not where I want to go.",
    ],
  },
];
