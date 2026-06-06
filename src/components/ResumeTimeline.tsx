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
    company: "WCTC, Waukesha WI",
    type: "education",
  },
  {
    id: "pse",
    year: "Jan – May 2025",
    title: "IT Help Desk Technician, Contract",
    company: "Puget Sound Energy",
    type: "work",
    description:
      "Remote tier-1 and tier-2 for a big Pacific Northwest utility. 150+ ServiceNow tickets a month, 5,000-user support pool, mostly via Cisco Jabber and Cisco Finesse. You get fast at triaging when the queue never gets shorter.",
  },
  {
    id: "wolter",
    year: "Jan – Jul 2024",
    title: "Technical Support Administrator",
    company: "Wolter Inc., Pewaukee WI",
    type: "work",
    description:
      "Internal IT for a forklift dealer, 200+ users across onsite and remote environments. 40-60 requests a week: AD issues, hardware failures, imaging, M365 administration. Wrote PowerShell scripts to automate the tedious stuff.",
  },
  {
    id: "ctaccess",
    year: "Jul 2023 – Dec 2023",
    title: "Service Desk Technician, Contract",
    company: "CTAccess, Waukesha WI",
    type: "work",
    description:
      "MSP service desk: 20-30 tickets a day across multiple client networks. Hardware, software, VPN issues, user accounts, all the standard tier-1 stuff. First place I used Active Directory every single day.",
  },
  {
    id: "matc",
    year: "May 2023",
    title: "Associate Degree, IT Network Specialist",
    company: "MATC, Milwaukee WI",
    type: "education",
  },
  {
    id: "wauwatosa",
    year: "Jan – Jun 2023",
    title: "IT Help Desk Specialist II",
    company: "City of Wauwatosa, Wauwatosa WI",
    type: "work",
    description:
      "Municipal help desk: 10-20 requests a day via phone, email, and ticketing. Login issues, account unlocks, password resets, printer problems. Escalated the harder stuff to senior techs while keeping SLAs intact.",
  },
  {
    id: "batteries-plus",
    year: "Apr – Dec 2022",
    title: "Desktop Support Specialist, Internship",
    company: "Batteries Plus",
    type: "work",
    description:
      "Tier-1 support for office and remote users: ticketing, routing, escalation. Configured equipment and accounts for new hires, helped run a laptop upgrade project, and kept asset inventory in Snipe-IT.",
  },
];

const FILTERS = ["all", "work", "education"] as const;

export function ResumeTimeline() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("all");
  const rows = timelineData.filter((i) => filter === "all" || i.type === filter);

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4 pb-3">
        <h2 className="font-serif text-base text-ink">Experience</h2>
        <div className="flex gap-4 font-mono text-[11px] uppercase tracking-wider">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
              className={`focus-ring transition-colors ${
                filter === f
                  ? "text-[var(--accent)]"
                  : "text-faint hover:text-muted"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div>
        {rows.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-1 gap-x-8 gap-y-1.5 border-t border-line py-6 sm:grid-cols-[160px_1fr]"
          >
            <div className="pt-0.5 font-mono text-xs text-faint">{item.year}</div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                <h3 className="font-medium text-ink">{item.title}</h3>
                <span className="text-sm text-[var(--accent)]">{item.company}</span>
              </div>
              {item.description && (
                <p className="mt-2 max-w-[62ch] text-sm leading-relaxed text-muted">
                  {item.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
