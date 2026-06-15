import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { buildCatalog, deriveFacts } from "./pipeline";

const generatedAt = new Date().toISOString();
const catalog = buildCatalog(generatedAt);
const facts = deriveFacts(catalog, generatedAt);
const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

async function writeJson(path: string, value: unknown) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

await writeJson(resolve(packageRoot, "generated/catalog.v1.json"), catalog);
await writeJson(resolve(packageRoot, "generated/facts.v1.json"), facts);
