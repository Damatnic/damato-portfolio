import { describe, it, expect } from "vitest";
import { toCsv } from "@/lib/csv";

describe("toCsv", () => {
  it("emits a header row from the column keys", () => {
    expect(toCsv([{ a: 1, b: 2 }], ["a", "b"]).split("\n")[0]).toBe("a,b");
  });

  it("emits cells in column order, one row per line", () => {
    const csv = toCsv(
      [
        { a: "x", b: "y" },
        { a: "z", b: "w" },
      ],
      ["a", "b"],
    );
    expect(csv).toBe("a,b\nx,y\nz,w");
  });

  it("quotes fields with commas, quotes, or newlines (RFC 4180)", () => {
    const csv = toCsv(
      [{ name: "Korea, Republic of", note: 'said "hi"', multi: "a\nb" }],
      ["name", "note", "multi"],
    );
    expect(csv).toBe('name,note,multi\n"Korea, Republic of","said ""hi""","a\nb"');
  });

  it("renders null/undefined cells as empty strings", () => {
    const csv = toCsv([{ a: null, b: undefined, c: 0 }], ["a", "b", "c"]);
    expect(csv).toBe("a,b,c\n,,0");
  });

  it("returns a header-only line for an empty row set", () => {
    expect(toCsv([], ["a", "b"])).toBe("a,b");
  });
});
