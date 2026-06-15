import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { catalogSchema, factsSchema, insightsSchema } from "@cosmic/shared";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const apiBaseUrl = process.env.COSMIC_API_BASE_URL?.replace(/\/$/, "");
const refreshToken = process.env.ADMIN_REFRESH_TOKEN;

if (!apiBaseUrl || !refreshToken) {
  throw new Error("COSMIC_API_BASE_URL and ADMIN_REFRESH_TOKEN are required.");
}

const [catalog, facts, insights] = await Promise.all([
  readJson("generated/catalog.v1.json", catalogSchema.parse),
  readJson("generated/facts.v1.json", factsSchema.parse),
  readJson("generated/insights.v1.json", insightsSchema.parse)
]);

const response = await fetch(`${apiBaseUrl}/api/admin/refresh`, {
  method: "POST",
  headers: {
    authorization: `Bearer ${refreshToken}`,
    "content-type": "application/json"
  },
  body: JSON.stringify({ catalog, facts, insights })
});

if (!response.ok) {
  throw new Error(`Admin refresh failed with ${response.status}: ${await response.text()}`);
}

console.log(await response.text());

async function readJson<T>(path: string, parse: (value: unknown) => T): Promise<T> {
  const raw = await readFile(resolve(packageRoot, path), "utf8");
  return parse(JSON.parse(raw));
}
