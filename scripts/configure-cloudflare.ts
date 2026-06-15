import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

type ConfigureOptions = {
  accountId?: string;
  kvNamespaceId: string;
  kvPreviewNamespaceId?: string;
};

export function configureWranglerText(input: string, options: ConfigureOptions): string {
  const kvPreviewNamespaceId = options.kvPreviewNamespaceId || options.kvNamespaceId;
  let wrangler = replaceOrInsertTopLevel(input, "account_id", options.accountId);
  wrangler = replaceRequiredLine(wrangler, "id", options.kvNamespaceId);
  wrangler = replaceRequiredLine(wrangler, "preview_id", kvPreviewNamespaceId);
  return wrangler;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const wranglerPath = resolve("apps/api/wrangler.toml");
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const kvNamespaceId = process.env.COSMIC_CACHE_KV_ID;
  const kvPreviewNamespaceId = process.env.COSMIC_CACHE_PREVIEW_KV_ID || kvNamespaceId;

  if (!kvNamespaceId || !kvPreviewNamespaceId) {
    throw new Error("COSMIC_CACHE_KV_ID is required. COSMIC_CACHE_PREVIEW_KV_ID is optional and defaults to COSMIC_CACHE_KV_ID.");
  }

  const input = await readFile(wranglerPath, "utf8");
  const output = configureWranglerText(input, {
    accountId,
    kvNamespaceId,
    kvPreviewNamespaceId
  });

  await writeFile(wranglerPath, output, "utf8");
  console.log(`Configured ${wranglerPath}`);
}

function replaceOrInsertTopLevel(input: string, key: string, value: string | undefined): string {
  const pattern = new RegExp(`^${key} = ".*"$`, "m");
  if (!value) return input.replace(pattern, "").replace(/\n{3,}/g, "\n\n");
  if (pattern.test(input)) return input.replace(pattern, `${key} = "${value}"`);
  return input.replace(/^(compatibility_date = ".*")$/m, `$1\n${key} = "${value}"`);
}

function replaceRequiredLine(input: string, key: string, value: string): string {
  const pattern = new RegExp(`^${key} = ".*"$`, "m");
  if (!pattern.test(input)) {
    throw new Error(`Could not find ${key} in apps/api/wrangler.toml.`);
  }

  return input.replace(pattern, `${key} = "${value}"`);
}
