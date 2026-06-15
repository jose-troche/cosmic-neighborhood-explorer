import { describe, expect, it } from "vitest";
import catalogSeed from "../../../packages/data/generated/catalog.v1.json";
import factsSeed from "../../../packages/data/generated/facts.v1.json";
import insightsSeed from "../../../packages/data/generated/insights.v1.json";
import { createApp } from "./app";

function env(overrides: Partial<Env> = {}): Env {
  const store = new Map<string, string>();
  const kv = {
    get: async (key: string) => {
      const value = store.get(key);
      return value ? JSON.parse(value) : null;
    },
    put: async (key: string, value: string) => {
      store.set(key, value);
    }
  } as unknown as KVNamespace;

  return {
    COSMIC_CACHE: kv,
    BUILD_VERSION: "test",
    ADMIN_REFRESH_TOKEN: "secret",
    ...overrides
  };
}

describe("api routes", () => {
  it("serves health from bundled seed data when KV is empty", async () => {
    const response = await createApp().request("/api/health", {}, env());
    const body = (await response.json()) as { ok: boolean; snapshotVersion: string; sourceStatuses: unknown[] };

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.snapshotVersion).toBe("v1");
    expect(body.sourceStatuses.length).toBeGreaterThan(0);
  });

  it("sets public cache headers for catalog responses", async () => {
    const response = await createApp().request("/api/catalog", {}, env());

    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toContain("s-maxage=3600");
  });

  it("rejects admin refresh without a bearer token", async () => {
    const response = await createApp().request("/api/admin/refresh", { method: "POST" }, env());

    expect(response.status).toBe(401);
  });

  it("serves insights, deep sky objects, NEOs, and worlds", async () => {
    const app = createApp();
    const testEnv = env();

    const insights = await app.request("/api/insights", {}, testEnv);
    const deepSky = await app.request("/api/deep-sky", {}, testEnv);
    const neos = await app.request("/api/near-earth-objects", {}, testEnv);
    const worlds = await app.request("/api/worlds", {}, testEnv);

    expect(insights.status).toBe(200);
    expect(deepSky.status).toBe(200);
    expect(neos.status).toBe(200);
    expect(worlds.status).toBe(200);
  });

  it("accepts schema-valid admin refresh payloads", async () => {
    const response = await createApp().request(
      "/api/admin/refresh",
      {
        method: "POST",
        headers: {
          authorization: "Bearer secret",
          "content-type": "application/json"
        },
        body: JSON.stringify({
          catalog: catalogSeed,
          facts: factsSeed,
          insights: insightsSeed
        })
      },
      env()
    );

    expect(response.status).toBe(200);
  });

  it("rejects admin refresh payloads with mismatched versions", async () => {
    const response = await createApp().request(
      "/api/admin/refresh",
      {
        method: "POST",
        headers: {
          authorization: "Bearer secret",
          "content-type": "application/json"
        },
        body: JSON.stringify({
          catalog: catalogSeed,
          facts: { ...factsSeed, version: "v2" },
          insights: insightsSeed
        })
      },
      env()
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: "Refresh payload versions must match." });
  });

  it("rejects admin refresh payloads with mismatched timestamps", async () => {
    const response = await createApp().request(
      "/api/admin/refresh",
      {
        method: "POST",
        headers: {
          authorization: "Bearer secret",
          "content-type": "application/json"
        },
        body: JSON.stringify({
          catalog: catalogSeed,
          facts: { ...factsSeed, generatedAt: "2026-06-14T00:00:00.000Z" },
          insights: insightsSeed
        })
      },
      env()
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: "Refresh payload timestamps must match." });
  });
});
