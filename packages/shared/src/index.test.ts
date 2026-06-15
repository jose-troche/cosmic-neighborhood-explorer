import { describe, expect, it } from "vitest";
import { SPEED_PRESETS, catalogSchema, formatDurationYears, travelYears } from "./index";

describe("travel math", () => {
  it("computes Voyager-scale interstellar travel times", () => {
    const voyager = SPEED_PRESETS.find((speed) => speed.id === "voyager-1");
    expect(voyager).toBeDefined();
    expect(Math.round(travelYears(4.2465, voyager!.kmS) / 1000)).toBe(75);
  });

  it("formats large durations for the UI", () => {
    expect(formatDurationYears(75_000)).toBe("75,000 years");
    expect(formatDurationYears(2_400_000)).toBe("2.4 million years");
  });
});

describe("catalog schema", () => {
  it("accepts the catalog shape", () => {
    const parsed = catalogSchema.safeParse({
      version: "v1",
      generatedAt: "2026-06-14T00:00:00.000Z",
      sources: [{ name: "Source", url: "https://example.com", notes: "fixture" }],
      sourceStatuses: [
        {
          id: "fixture",
          name: "Source",
          url: "https://example.com",
          status: "ok",
          fetchedAt: "2026-06-14T00:00:00.000Z",
          recordCount: 1
        }
      ],
      stars: [],
      exoplanets: [],
      nearEarthObjects: [],
      deepSkyObjects: [],
      worldProfiles: [],
      travelTargets: []
    });

    expect(parsed.success).toBe(true);
  });
});
