"use client";

import Link from "next/link";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main
      id="main"
      className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-start justify-center px-6 py-16 text-stone-100"
    >
      <p className="font-mono text-xs uppercase tracking-widest text-[var(--accent)]">
        {"// something broke"}
      </p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
        That page hit an error.
      </h1>
      <p className="mt-4 max-w-[55ch] leading-relaxed text-stone-300">
        Not your fault. Try again, or head back to the portfolio.
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-4 text-sm">
        <button
          type="button"
          onClick={reset}
          className="rounded-md bg-[var(--accent)] px-4 py-2 font-medium text-stone-950 transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-stone-950"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded text-stone-300 underline-offset-4 hover:text-[var(--accent)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-stone-950"
        >
          ← back to portfolio
        </Link>
      </div>
    </main>
  );
}
