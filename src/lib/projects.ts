export type Project = {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  bullets: string[];
  tech: string[];
  github: string;
  imagePath?: string;
  imageGradient: string;
  imageInitials: string;
};

export const projects: Project[] = [
  {
    slug: "olympic-medal-etl",
    title: "Olympic Medal Data Pipeline",
    tagline: "End-to-end ETL: web scraping → SQL Server → multi-tab Excel",
    description:
      "Built a complete data pipeline scraping Tokyo 2020 and Beijing 2022 medal results from Olympedia, enriching them with continent and capital data from SQL Server, and exporting a multi-tab Excel workbook with four pivot summaries.",
    bullets: [
      "Hand-parsed Olympedia HTML with BeautifulSoup after pandas.read_html failed on embedded flag image tags",
      "Enriched 1,344 medal records with continent + capital from SQL Server via pymssql, left-joining IOC ↔ ISO country codes",
      "Exported multi-tab Excel with openpyxl plus 4 pivot summaries (continent/country, by Olympics, by medal type, top 5)",
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
    imageGradient: "from-amber-500 via-yellow-400 to-orange-500",
    imageInitials: "🏅",
  },
  {
    slug: "car-rental-sql-server",
    title: "Car Rental Database (SQL Server)",
    tagline: "Production-grade schema with partitioning and audit triggers",
    description:
      "Designed and implemented an 11-table SQL Server database from an ER diagram for a small car rental business. Year-based table partitioning with custom filegroups, AFTER INSERT/UPDATE/DELETE history triggers, and dynamic SQL for portable file paths.",
    bullets: [
      "11-table relational schema with surrogate keys, foreign keys, check constraints, and unique constraints",
      "Year-based partitioning on Rentals + Reservation tables; 2022 partition on dedicated FG_CarRental_2022 filegroup",
      "History tables + AFTER I/U/D triggers across 6 tables for full audit trail; filtered + covering indexes for performance",
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
    tagline: "3-page interactive dashboard on a star schema",
    description:
      "Built an interactive Power BI dashboard from a star schema with DAX measures, slicer-driven filtering, and drill-through pages. Sales overview, employee performance details, and salary-vs-performance analysis.",
    bullets: [
      "Sales overview page: KPI cards, YoY growth, sales by region, top products",
      "Sales details page: employee performance scorecard with drill-through, promotion effectiveness",
      "Salary analysis page: compensation vs review scores via Sales Reviews 1:1 relationship",
    ],
    tech: ["Power BI", "DAX", "Star Schema", "Data Visualization"],
    github: "https://github.com/Damatnic/power-bi-sales-dashboard",
    imageGradient: "from-violet-500 via-fuchsia-400 to-pink-500",
    imageInitials: "📊",
  },
];
