"use client";

// Catches errors thrown in the root layout itself. Must render its own
// <html>/<body> because it replaces the entire document.
export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          gap: 20,
          padding: "0 24px",
          background: "#0c0a09",
          color: "#f5f5f4",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        }}
      >
        <h1 style={{ fontSize: 32, fontWeight: 600, margin: 0 }}>
          Something went wrong.
        </h1>
        <p style={{ color: "#a8a29e", margin: 0 }}>
          The page failed to load. Try reloading.
        </p>
        <button
          type="button"
          onClick={reset}
          style={{
            background: "#e8a838",
            color: "#0c0a09",
            border: "none",
            borderRadius: 6,
            padding: "10px 16px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
