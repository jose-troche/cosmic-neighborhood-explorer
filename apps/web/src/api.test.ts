import { afterEach, describe, expect, it, vi } from "vitest";
import { loadCatalogFrom, loadFactsFrom, loadInsightsFrom } from "./api";

describe("web API loader", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("uses the Worker API when configured and valid", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        Response.json({
          version: "v1",
          generatedAt: "2026-06-14T00:00:00.000Z",
          sources: [],
          sourceStatuses: [],
          stars: [],
          exoplanets: [],
          nearEarthObjects: [],
          deepSkyObjects: [],
          worldProfiles: [],
          travelTargets: []
        })
      )
    );

    const catalog = await loadCatalogFrom("https://api.example.com/");

    expect(catalog.generatedAt).toBe("2026-06-14T00:00:00.000Z");
    expect(fetch).toHaveBeenCalledWith("https://api.example.com/api/catalog");
  });

  it("falls back to bundled snapshots when the Worker API is unavailable", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
    vi.stubGlobal("fetch", vi.fn(async () => new Response("nope", { status: 503 })));

    const [catalog, facts, insights] = await Promise.all([
      loadCatalogFrom("https://api.example.com"),
      loadFactsFrom("https://api.example.com"),
      loadInsightsFrom("https://api.example.com")
    ]);

    expect(catalog.stars.length).toBeGreaterThan(0);
    expect(facts.facts.length).toBeGreaterThan(0);
    expect(insights.discoveryTimeline.length).toBeGreaterThan(0);
    expect(console.warn).toHaveBeenCalledTimes(3);
  });

  it("falls back to bundled snapshots when the Worker returns invalid catalog data", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
    vi.stubGlobal("fetch", vi.fn(async () => Response.json({ version: "v1" })));

    const catalog = await loadCatalogFrom("https://api.example.com");

    expect(catalog.exoplanets.length).toBeGreaterThan(0);
    expect(console.warn).toHaveBeenCalledOnce();
  });
});
