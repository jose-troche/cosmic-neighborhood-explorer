import { Hono } from "hono";
import { cors } from "hono/cors";
import { catalogSchema, factsSchema, insightsSchema, type Catalog, type FactsPayload, type InsightsPayload } from "@cosmic/shared";
import catalogSeed from "../../../packages/data/generated/catalog.v1.json";
import factsSeed from "../../../packages/data/generated/facts.v1.json";
import insightsSeed from "../../../packages/data/generated/insights.v1.json";

const CATALOG_KEY = "catalog:v1";
const FACTS_KEY = "facts:v1";
const INSIGHTS_KEY = "insights:v1";
const PUBLIC_CACHE = "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400";

type AppEnv = {
  Bindings: Env;
};

async function getJson<T>(env: Env, key: string, fallback: unknown, parse: (value: unknown) => T): Promise<T> {
  const cached = await env.COSMIC_CACHE?.get(key, "json");
  return parse(cached ?? fallback);
}

async function getCatalog(env: Env): Promise<Catalog> {
  return getJson(env, CATALOG_KEY, catalogSeed, (value) => catalogSchema.parse(value));
}

async function getFacts(env: Env): Promise<FactsPayload> {
  return getJson(env, FACTS_KEY, factsSeed, (value) => factsSchema.parse(value));
}

async function getInsights(env: Env): Promise<InsightsPayload> {
  return getJson(env, INSIGHTS_KEY, insightsSeed, (value) => insightsSchema.parse(value));
}

export async function refreshCache(env: Env, catalog: Catalog, facts: FactsPayload, insights: InsightsPayload) {
  await Promise.all([
    env.COSMIC_CACHE.put(CATALOG_KEY, JSON.stringify(catalog)),
    env.COSMIC_CACHE.put(FACTS_KEY, JSON.stringify(facts)),
    env.COSMIC_CACHE.put(INSIGHTS_KEY, JSON.stringify(insights))
  ]);
}

export function createApp() {
  const app = new Hono<AppEnv>();

  app.use(
    "/api/*",
    cors({
      origin: "*",
      allowMethods: ["GET", "POST", "OPTIONS"],
      maxAge: 86_400
    })
  );

  app.get("/api/health", async (c) => {
    const catalog = await getCatalog(c.env);
    return c.json(
      {
        ok: true,
        service: "cosmic-neighborhood-api",
        buildVersion: c.env.BUILD_VERSION ?? "local",
        snapshotVersion: catalog.version,
        generatedAt: catalog.generatedAt,
        sourceStatuses: catalog.sourceStatuses
      },
      200,
      { "Cache-Control": "public, max-age=60, s-maxage=300" }
    );
  });

  app.get("/api/catalog", async (c) => {
    const catalog = await getCatalog(c.env);
    return c.json(catalog, 200, { "Cache-Control": PUBLIC_CACHE });
  });

  app.get("/api/facts", async (c) => {
    const facts = await getFacts(c.env);
    return c.json(facts, 200, { "Cache-Control": PUBLIC_CACHE });
  });

  app.get("/api/insights", async (c) => {
    const insights = await getInsights(c.env);
    return c.json(insights, 200, { "Cache-Control": PUBLIC_CACHE });
  });

  app.get("/api/travel-targets", async (c) => {
    const catalog = await getCatalog(c.env);
    return c.json({ version: catalog.version, targets: catalog.travelTargets }, 200, { "Cache-Control": PUBLIC_CACHE });
  });

  app.get("/api/near-earth-objects", async (c) => {
    const catalog = await getCatalog(c.env);
    return c.json({ version: catalog.version, objects: catalog.nearEarthObjects }, 200, { "Cache-Control": PUBLIC_CACHE });
  });

  app.get("/api/deep-sky", async (c) => {
    const catalog = await getCatalog(c.env);
    return c.json({ version: catalog.version, objects: catalog.deepSkyObjects }, 200, { "Cache-Control": PUBLIC_CACHE });
  });

  app.get("/api/worlds", async (c) => {
    const catalog = await getCatalog(c.env);
    return c.json({ version: catalog.version, worlds: catalog.worldProfiles }, 200, { "Cache-Control": PUBLIC_CACHE });
  });

  app.post("/api/admin/refresh", async (c) => {
    const token = c.req.header("authorization")?.replace(/^Bearer\s+/i, "");

    if (!token || token !== c.env.ADMIN_REFRESH_TOKEN) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const body = await c.req.json().catch(() => null);
    const parsedCatalog = catalogSchema.safeParse(body?.catalog);
    const parsedFacts = factsSchema.safeParse(body?.facts);
    const parsedInsights = insightsSchema.safeParse(body?.insights);

    if (!parsedCatalog.success || !parsedFacts.success || !parsedInsights.success) {
      return c.json({ error: "Refresh payload must include schema-valid catalog, facts, and insights." }, 400);
    }

    if (
      parsedCatalog.data.version !== parsedFacts.data.version ||
      parsedCatalog.data.version !== parsedInsights.data.version
    ) {
      return c.json({ error: "Refresh payload versions must match." }, 400);
    }

    if (
      parsedCatalog.data.generatedAt !== parsedFacts.data.generatedAt ||
      parsedCatalog.data.generatedAt !== parsedInsights.data.generatedAt
    ) {
      return c.json({ error: "Refresh payload timestamps must match." }, 400);
    }

    await refreshCache(c.env, parsedCatalog.data, parsedFacts.data, parsedInsights.data);

    return c.json({
      ok: true,
      version: parsedCatalog.data.version,
      generatedAt: parsedCatalog.data.generatedAt
    });
  });

  app.notFound((c) => c.json({ error: "Not found" }, 404));

  return app;
}
