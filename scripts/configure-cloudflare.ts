import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const wranglerPath = resolve("apps/api/wrangler.toml");
const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const kvNamespaceId = process.env.COSMIC_CACHE_KV_ID;
const kvPreviewNamespaceId = process.env.COSMIC_CACHE_PREVIEW_KV_ID || kvNamespaceId;

if (!kvNamespaceId || !kvPreviewNamespaceId) {
  throw new Error("COSMIC_CACHE_KV_ID is required. COSMIC_CACHE_PREVIEW_KV_ID is optional and defaults to COSMIC_CACHE_KV_ID.");
}

let wrangler = await readFile(wranglerPath, "utf8");

wrangler = replaceOrInsertTopLevel(wrangler, "account_id", accountId);
wrangler = wrangler.replace(/^id = ".*"/, `id = "${kvNamespaceId}"`);
wrangler = wrangler.replace(/^preview_id = ".*"/, `preview_id = "${kvPreviewNamespaceId}"`);

await writeFile(wranglerPath, wrangler, "utf8");
console.log(`Configured ${wranglerPath}`);

function replaceOrInsertTopLevel(input: string, key: string, value: string | undefined): string {
  const pattern = new RegExp(`^${key} = ".*"$`, "m");
  if (!value) return input.replace(pattern, "").replace(/\n{3,}/g, "\n\n");
  if (pattern.test(input)) return input.replace(pattern, `${key} = "${value}"`);
  return input.replace(/^(compatibility_date = ".*")$/m, `$1\n${key} = "${value}"`);
}

export {};
