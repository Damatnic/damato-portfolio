/** Quote a field if it contains a comma, double-quote, or newline (RFC 4180). */
function escapeCsvField(value: string): string {
  return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

/**
 * Build an RFC 4180 CSV string. The first line is the column keys; each row
 * emits those columns in order. Null/undefined cells become empty strings.
 */
export function toCsv(
  rows: readonly Record<string, unknown>[],
  columns: readonly string[],
): string {
  const header = columns.map(escapeCsvField).join(",");
  const body = rows.map((row) =>
    columns.map((c) => escapeCsvField(String(row[c] ?? ""))).join(","),
  );
  return [header, ...body].join("\n");
}
