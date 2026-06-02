import { describe, it, expect } from "vitest";
import { dayKey, todayKey, lastNDayKeys } from "@/lib/analyticsTime";

describe("analyticsTime", () => {
  it("dayKey returns a YYYY-MM-DD string", () => {
    expect(dayKey(Date.UTC(2026, 5, 15, 12))).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("dayKey maps a midday-UTC instant to the expected calendar date", () => {
    // Noon UTC is morning in America/Chicago, so the date never rolls over.
    expect(dayKey(Date.UTC(2026, 5, 15, 12))).toBe("2026-06-15");
  });

  it("todayKey is a valid YYYY-MM-DD string", () => {
    expect(todayKey()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("lastNDayKeys returns N ascending, consecutive day keys", () => {
    const keys = lastNDayKeys(7, Date.UTC(2026, 5, 15, 12));
    expect(keys).toHaveLength(7);
    expect(keys[keys.length - 1]).toBe("2026-06-15");
    expect(keys[0]).toBe("2026-06-09");
    expect([...keys].sort()).toEqual(keys); // already ascending
  });
});
