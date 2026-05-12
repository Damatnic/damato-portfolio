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
  imagePath?: string;
  imageGradient: string;
  imageInitials: string;
};

export const projects: Project[] = [
  {
    slug: "olympic-medal-etl",
    title: "Olympic Medal Data Pipeline",
    tagline: "Python ETL from web pages into SQL Server, out to Excel",
    description:
      "Scrapes Tokyo 2020 and Beijing 2022 medal pages from Olympedia, enriches the records with continent and capital data from SQL Server, and exports a multi-tab Excel workbook with pivot summaries.",
    bullets: [
      "Hand-parsed the medal table with BeautifulSoup after pandas.read_html choked on embedded flag image tags",
      "Enriched 1,344 medal records with continent and capital from SQL Server via pymssql, left-joined to deal with IOC vs ISO country code mismatches",
      "Exported a two-tab Excel workbook with openpyxl plus four pivot summaries (continent and country, by Olympics, by medal type, top five countries)",
    ],
    tech: [
      "Python",
      "BeautifulSoup",
      "pandas",
      "pymssql",
      "openpyxl",
      "SQL Server",
      "ETL",
    ],
    github: "https://github.com/Damatnic/olympic-medal-etl",
    demoUrl: "/projects/olympic-medals",
    demoLabel: "Try the dashboard",
    imageGradient: "from-amber-500 via-yellow-400 to-orange-500",
    imageInitials: "🏅",
  },
  {
    slug: "car-rental-sql-server",
    title: "Car Rental Database (SQL Server)",
    tagline: "Schema with partitioning, audit triggers, and dynamic file paths",
    description:
      "An 11-table SQL Server database built from an ER diagram for a small car rental business. Includes year-based table partitioning, history triggers for audit trails, and dynamic SQL so the script runs on any SQL Server install without manual editing.",
    bullets: [
      "11 tables with surrogate keys, foreign keys, check constraints, and unique constraints on the original composite keys",
      "Year-based partitioning on Rentals and Reservation, with the 2022 partition on its own filegroup and data file",
      "History tables and AFTER INSERT/UPDATE/DELETE triggers across six tables for a full audit trail, plus filtered and covering indexes for the common queries",
    ],
    tech: [
      "T-SQL",
      "SQL Server",
      "ER Modeling",
      "Partitioning",
      "Triggers",
      "Indexing",
    ],
    github: "https://github.com/Damatnic/car-rental-sql-server",
    imagePath: "/projects/car-rental-er.png",
    imageGradient: "from-sky-500 via-cyan-400 to-blue-500",
    imageInitials: "🗄️",
  },
  {
    slug: "power-bi-sales-dashboard",
    title: "Power BI Sales Dashboard",
    tagline: "Three-page interactive dashboard on a star schema",
    description:
      "A three-page Power BI dashboard built on a star schema with DAX measures, slicer-driven filters, and drill-through pages. Sales overview, employee performance details, and a salary-vs-review-score breakdown.",
    bullets: [
      "Sales overview: KPI cards, year-over-year growth, sales by region, top products by revenue",
      "Employee details with drill-through, plus promotion effectiveness by Sales Amount and Order Quantity",
      "Salary vs review score analysis using a 1:1 relationship between Sales Reviews and the Employee table",
    ],
    tech: ["Power BI", "DAX", "Star Schema", "Data Visualization"],
    github: "https://github.com/Damatnic/power-bi-sales-dashboard",
    imageGradient: "from-violet-500 via-fuchsia-400 to-pink-500",
    imageInitials: "📊",
  },
];
