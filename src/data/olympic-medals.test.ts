import { describe, it, expect } from "vitest";
import medals from "./olympic-medals.json";
import { projects, sideProjects } from "@/lib/projects";

type MedalRow = {
  olympics: string;
  season: string;
  category: string;
  event: string;
  athlete: string;
  code: string;
  country: string;
  medal: string;
  continent: string;
};

const rows = medals as MedalRow[];

describe("olympic-medals dataset", () => {
  it("contains exactly 1,343 records (the number cited across the site + resume)", () => {
    expect(rows.length).toBe(1343);
  });

  it("only Gold / Silver / Bronze medals", () => {
    const kinds = [...new Set(rows.map((r) => r.medal))].sort();
    expect(kinds).toEqual(["Bronze", "Gold", "Silver"]);
  });

  it("every continent is from the known five", () => {
    const allowed = new Set(["Africa", "Americas", "Asia", "Europe", "Oceania"]);
    const unknown = rows.filter((r) => !allowed.has(r.continent));
    expect(unknown).toHaveLength(0);
  });

  it("covers only Tokyo 2020 and Beijing 2022", () => {
    const games = [...new Set(rows.map((r) => r.olympics))].sort();
    expect(games).toEqual(["Beijing 2022", "Tokyo 2020"]);
  });

  it("has no empty country / continent / athlete fields", () => {
    const broken = rows.filter((r) => !r.country || !r.continent || !r.athlete);
    expect(broken).toHaveLength(0);
  });
});

describe("projects data integrity", () => {
  it("every project links to an https GitHub repo", () => {
    for (const p of [...projects, ...sideProjects]) {
      expect(p.github).toMatch(/^https:\/\/github\.com\/[\w.-]+\/[\w.-]+$/);
    }
  });

  it("flagship projects have a title, description, and at least one tech tag", () => {
    for (const p of projects) {
      expect(p.title.trim().length).toBeGreaterThan(0);
      expect(p.description.trim().length).toBeGreaterThan(0);
      expect(p.tech.length).toBeGreaterThan(0);
    }
  });

  it("side projects expose an https live URL", () => {
    for (const p of sideProjects) {
      expect(p.liveUrl).toMatch(/^https:\/\//);
    }
  });
});
