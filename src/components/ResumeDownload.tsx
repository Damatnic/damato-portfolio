"use client";
import { FileDown } from "lucide-react";

export function ResumeDownload() {
  return (
    <a
      href="/DAmato_Resume_DataAnalyst.pdf"
      download
      onClick={() => {
        try {
          navigator.sendBeacon("/api/resume-download", JSON.stringify({}));
        } catch {}
      }}
      className="inline-flex items-center gap-2 rounded-md border border-[var(--accent)]/50 bg-[var(--accent-soft)] px-4 py-2 text-sm font-medium text-[var(--accent)] transition hover:bg-[var(--accent)]/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-stone-950"
    >
      <FileDown className="h-4 w-4" aria-hidden="true" />
      Download Resume (PDF)
    </a>
  );
}