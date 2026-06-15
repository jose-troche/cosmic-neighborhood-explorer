import { describe, expect, it } from "vitest";
import { catalogSchema, factsSchema } from "@cosmic/shared";
import { buildCatalog, deriveFacts } from "./pipeline";

describe("data pipeline", () => {
  it("generates schema-valid catalog and facts", () => {
    const catalog = buildCatalog("2026-06-14T00:00:00.000Z");
    const facts = deriveFacts(catalog);

    expect(catalogSchema.safeParse(catalog).success).toBe(true);
    expect(factsSchema.safeParse(facts).success).toBe(true);
    expect(facts.facts.map((fact) => fact.id)).toContain("voyager-to-proxima");
  });
});
