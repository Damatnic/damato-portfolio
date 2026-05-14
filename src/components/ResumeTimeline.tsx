"use client";
import { useState } from "react";

type TimelineItem = {
  id: string;
  year: string;
  title: string;
  company: string;
  type: "work" | "education";
  description?: string;
};

const timelineData: TimelineItem[] = [
  {
    id: "wctc",
    year: "Expected 2027",
    title: "AAS, AI Data Specialist",
    company: "WCTC, Waukesha, WI",
    type: "education"
  },
  {
    id: "pse",
    year: "Jan 2025 – May 2025",
    title: "IT Help Desk Technician",
    company: "Puget Sound Energy (Contract/Remote)",
    type: "work",
    description:
      "Remote tier-1 and tier-2 for a big Pacific Northwest utility. 150+ ServiceNow tickets a month, 5,000-user support pool, mostly via Cisco Jabber and Cisco Finesse. You get fast at triaging when the queue never gets shorter.",
  },
  {
    id: "wolter",
    year: "Dec 2023 – Jul 2024",
    title: "Technical Support Administrator",
    company: "Wolter Inc., Pewaukee WI",
    type: "work",
    description:
      "Internal IT for a forklift dealer, 200+ users across onsite and remote environments. 40-60 requests a week: AD issues, hardware failures, imaging, M365 administration. Wrote PowerShell scripts to automate the tedious stuff.",
  },
  {
    id: "ctaccess",
    year: "Jul 2023 – Jan 2024",
    title: "Service Desk Technician",
    company: "CTAccess, Waukesha WI",
    type: "work",
    description:
      "MSP service desk: 20-30 tickets a day across multiple client networks. Hardware, software, VPN issues, user accounts — all the standard tier-1 stuff. First place I used Active Directory every single day.",
  },
  {
    id: "wauwatosa",
    year: "Jan 2023 – Jun 2023",
    title: "IT Help Desk Specialist II",
    company: "City of Wauwatosa, Wauwatosa WI",
    type: "work",
    description:
      "Municipal help desk: 10-20 requests a day via phone, email, and ticketing. Login issues, account unlocks, password resets, printer problems. Escalated the harder stuff to senior techs while keeping SLAs intact.",
  },
  {
    id: "batteries-plus",
    year: "Apr 2022 – Dec 2022",
    title: "Desktop Support Specialist (Internship)",
    company: "Batteries Plus",
    type: "work",
    description:
      "Tier-1 support for office and remote users: ticketing, routing, escalation. Configured equipment and accounts for new hires, helped run a laptop upgrade project, and kept asset inventory in Snipe-IT.",
  },
  {
    id: "matc",
    year: "May 2023",
    title: "Associate Degree, IT Network Specialist",
    company: "MATC, Milwaukee, WI",
    type: "education"
  }
];

export function ResumeTimeline() {
  const [filter, setFilter] = useState<"all" | "work" | "education">("all");

  const filteredData = timelineData.filter(
    (item) => filter === "all" || item.type === filter
  );

  return (
    <div className="mt-14 pt-8 border-t border-stone-800/60">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-semibold text-stone-100">Interactive Resume</h3>
        <div className="flex gap-2 bg-stone-900/50 p-1 rounded-lg border border-stone-800">
          {(["all", "work", "education"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-colors ${
                filter === f
                  ? "bg-stone-800 text-stone-100 shadow-sm ring-1 ring-stone-700/50"
                  : "text-stone-400 hover:text-stone-200"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="relative border-l border-stone-800 ml-3 space-y-10">
        {filteredData.map((item) => (
          <div key={item.id} className="relative pl-6 sm:pl-8 group">
            <span
              className={`absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-stone-950 transition-colors ${
                item.type === "work" ? "bg-[var(--accent)]" : "bg-stone-500"
              }`}
            />
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-1">
              <h4 className="text-base font-medium text-stone-200">{item.title}</h4>
              <time className="text-xs font-mono text-stone-500 mt-1 sm:mt-0 shrink-0">
                {item.year}
              </time>
            </div>
            <p className="text-sm font-medium text-[var(--accent)]">{item.company}</p>
            {item.description && (
              <p className="mt-2 text-sm text-stone-400 leading-relaxed max-w-[55ch]">
                {item.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
