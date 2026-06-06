export default function Loading() {
  return (
    <main
      id="main"
      className="mx-auto flex min-h-[60vh] max-w-2xl items-center px-6 py-16"
      role="status"
      aria-live="polite"
    >
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-faint">
        Loading…
      </p>
      <span className="sr-only">Loading</span>
    </main>
  );
}
