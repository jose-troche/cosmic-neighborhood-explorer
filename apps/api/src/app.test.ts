import { describe, expect, it } from "vitest";
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
    const body = (await response.json()) as { ok: boolean; snapshotVersion: string };

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.snapshotVersion).toBe("v1");
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
});
