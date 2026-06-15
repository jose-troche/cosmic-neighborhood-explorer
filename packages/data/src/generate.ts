import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { buildCatalog, deriveFacts, deriveInsights } from "./pipeline";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const generatedAt = new Date().toISOString();
const sourceSnapshot = await readSourceSnapshot();
const catalog = buildCatalog(generatedAt, sourceSnapshot);
const facts = deriveFacts(catalog, generatedAt);
const insights = deriveInsights(catalog, generatedAt);

async function writeJson(path: string, value: unknown) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

await writeJson(resolve(packageRoot, "generated/catalog.v1.json"), catalog);
await writeJson(resolve(packageRoot, "generated/facts.v1.json"), facts);
await writeJson(resolve(packageRoot, "generated/insights.v1.json"), insights);

async function readSourceSnapshot(): Promise<unknown | undefined> {
  try {
    const raw = await readFile(resolve(packageRoot, "source-cache/source-snapshot.json"), "utf8");
    return JSON.parse(raw);
  } catch (error) {
    const code = typeof error === "object" && error && "code" in error ? error.code : undefined;
    if (code === "ENOENT") return undefined;
    throw error;
  }
}
