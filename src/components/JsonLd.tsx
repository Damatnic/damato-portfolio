/**
 * Renders a JSON-LD structured-data block. Server-safe (no client JS) — drop it
 * anywhere in a server component's tree.
 */
export function JsonLd({ data }: { data: object }) {
  // Data is author-controlled (static project/site config, no user input). We
  // still escape "<" so a stray "</script>" in any string can never break out
  // of the script block — the standard hardening for inline JSON-LD.
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
  );
}
