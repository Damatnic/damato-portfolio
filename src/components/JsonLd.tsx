// Renders a JSON-LD block. Server-safe (no client JS), drop it in any server tree.
export function JsonLd({ data }: { data: object }) {
  // Escape "<" so a stray "</script>" in any string can't break out of the block.
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
  );
}
