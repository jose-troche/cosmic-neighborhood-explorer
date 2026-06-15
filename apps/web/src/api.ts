import { catalogSchema, factsSchema, insightsSchema, type Catalog, type FactsPayload, type InsightsPayload } from "@cosmic/shared";
import catalogSeed from "../../../packages/data/generated/catalog.v1.json";
import factsSeed from "../../../packages/data/generated/facts.v1.json";
import insightsSeed from "../../../packages/data/generated/insights.v1.json";

const apiBase = import.meta.env.VITE_API_BASE_URL ?? "";

export async function loadCatalog(): Promise<Catalog> {
  return loadCatalogFrom(apiBase);
}

export async function loadInsights(): Promise<InsightsPayload> {
  return loadInsightsFrom(apiBase);
}

export async function loadFacts(): Promise<FactsPayload> {
  return loadFactsFrom(apiBase);
}

export async function loadCatalogFrom(baseUrl: string): Promise<Catalog> {
  return loadWithFallback(baseUrl, "/api/catalog", catalogSeed, catalogSchema.parse, "catalog");
}

export async function loadFactsFrom(baseUrl: string): Promise<FactsPayload> {
  return loadWithFallback(baseUrl, "/api/facts", factsSeed, factsSchema.parse, "facts");
}

export async function loadInsightsFrom(baseUrl: string): Promise<InsightsPayload> {
  return loadWithFallback(baseUrl, "/api/insights", insightsSeed, insightsSchema.parse, "insights");
}

async function loadWithFallback<T>(
  baseUrl: string,
  path: string,
  fallback: unknown,
  parse: (value: unknown) => T,
  label: string
): Promise<T> {
  if (!baseUrl) {
    return parse(fallback);
  }

  try {
    const response = await fetch(`${baseUrl.replace(/\/$/, "")}${path}`);

    if (!response.ok) {
      throw new Error(`${label} request failed with ${response.status}`);
    }

    return parse(await response.json());
  } catch (error) {
    console.warn(`Using bundled ${label} snapshot because the Worker API is unavailable.`, error);
    return parse(fallback);
  }
}
