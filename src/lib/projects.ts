export type Project = {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  bullets: string[];
  tech: string[];
  github: string;
  demoUrl?: string;
  demoLabel?: string;
};

export type SideProject = {
  slug: string;
  title: string;
  description: string;
  tech: string[];
  github: string;
  liveUrl: string;
};

export const sideProjects: SideProject[] = [
  {
    slug: "python-mastery",
    title: "python-mastery",
    description:
      "Interactive Python lessons that run actual code in the browser via Pyodide. Built it while re-learning Python fundamentals for the AAS program. Teaching it back to myself turned out to be the best way to make it stick.",
    tech: ["Next.js", "TypeScript", "Pyodide", "Tailwind"],
    github: "https://github.com/Damatnic/python-mastery",
    liveUrl: "https://damato-python.vercel.app",
  },
  {
    slug: "sql-mastery",
    title: "sql-mastery",
    description:
      "Interactive SQL lessons with a real SQLite engine running in the browser via SQL.js. Every query runs against actual sample data, not pretend results. Built it the same semester I was taking Advanced SQL.",
    tech: ["Next.js", "TypeScript", "SQL.js", "Tailwind"],
    github: "https://github.com/Damatnic/sql-mastery",
    liveUrl: "https://damato-sql.vercel.app",
  },
];

export const projects: Project[] = [
  {
    slug: "olympic-medal-etl",
    title: "Olympic Medal Pipeline",
    tagline: "Python ETL, web pages into SQL Server, out to Excel",
    description:
      "Scrapes the Tokyo 2020 and Beijing 2022 medal pages from Olympedia, enriches the records with continent and capital data from SQL Server, exports a multi-tab Excel workbook with pivot summaries.",
    bullets: [
      "Hand-parsed the medal table with BeautifulSoup after pandas.read_html choked on embedded flag image tags",
      "Enriched 1,343 medal records with continent and capital from a SQL Server World database via pymssql, left-joined to deal with IOC vs ISO country code mismatches",
      "Wrote a two-tab Excel workbook with openpyxl plus four pivot summaries (continent and country, by Olympics, by medal type, top five countries)",
    ],
    tech: [
      "Python",
      "BeautifulSoup",
      "pandas",
      "pymssql",
      "openpyxl",
      "SQL Server",
    ],
    github: "https://github.com/Damatnic/olympic-medal-etl",
    demoUrl: "/projects/olympic-medals",
    demoLabel: "Try the dashboard",
  },
  {
    slug: "car-rental-sql-server",
    title: "Car Rental Database",
    tagline: "SQL Server schema with partitioning and audit triggers",
    description:
      "An 11-table SQL Server database built from an ER diagram for a small car rental business. Year-based table partitioning, history triggers for audit trails, and dynamic SQL so the script runs on any SQL Server install without editing.",
    bullets: [
      "11 tables with surrogate keys, foreign keys, check constraints, and unique constraints on the original composite keys",
      "Year-based partitioning on Rentals and Reservation, with the 2022 partition living on its own filegroup and data file",
      "AFTER INSERT/UPDATE/DELETE history triggers across six tables for a full audit trail, plus filtered and covering indexes for the common queries",
    ],
    tech: [
      "T-SQL",
      "SQL Server",
      "ER Modeling",
      "Partitioning",
      "Triggers",
    ],
    github: "https://github.com/Damatnic/car-rental-sql-server",
  },
  {
    slug: "power-bi-sales-dashboard",
    title: "Power BI Sales Dashboard",
    tagline: "Three-page dashboard on a star schema",
    description:
      "Built on a star schema (Sales fact plus Employee, Date, Product, Promotion, Sales Reviews dimensions). DAX measures for KPIs, slicer-driven filters, drill-through pages. Sales overview, employee performance, and salary-vs-review breakdown.",
    bullets: [
      "KPI cards, year-over-year growth, sales by region, top products by revenue",
      "Employee scorecard with drill-through, plus promotion effectiveness by Sales Amount and Order Quantity",
      "Salary versus review-score analysis using a 1:1 relationship between Sales Reviews and Employee",
    ],
    tech: ["Power BI", "DAX", "Star Schema"],
    github: "https://github.com/Damatnic/power-bi-sales-dashboard",
  },
];
