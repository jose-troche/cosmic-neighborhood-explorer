import { describe, expect, it } from "vitest";
import { catalogSchema, factsSchema, insightsSchema } from "@cosmic/shared";
import { buildCatalog, deriveFacts, deriveInsights } from "./pipeline";

describe("data pipeline", () => {
  it("generates schema-valid catalog and facts", () => {
    const catalog = buildCatalog("2026-06-14T00:00:00.000Z");
    const facts = deriveFacts(catalog);
    const insights = deriveInsights(catalog);

    expect(catalogSchema.safeParse(catalog).success).toBe(true);
    expect(factsSchema.safeParse(facts).success).toBe(true);
    expect(insightsSchema.safeParse(insights).success).toBe(true);
    expect(facts.facts.map((fact) => fact.id)).toContain("voyager-to-proxima");
    expect(catalog.deepSkyObjects.length).toBeGreaterThan(0);
    expect(catalog.worldProfiles.map((world) => world.id)).toContain("titan");
    expect(insights.discoveryTimeline.length).toBeGreaterThan(0);
  });
});
