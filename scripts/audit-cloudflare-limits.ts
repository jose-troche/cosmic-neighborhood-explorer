import { readdir, stat } from "node:fs/promises";
import { join, relative, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const mib = 1024 * 1024;

const limits = {
  workerBundleBytes: 3 * mib,
  pagesAssetBytes: 25 * mib,
  kvValueBytes: 25 * mib
};

type Check = {
  label: string;
  path: string;
  bytes: number;
  limit: number;
};

const checks: Check[] = [];

await addFileChecks("KV generated value", "packages/data/generated", limits.kvValueBytes);
await addFileChecks("Pages asset", "apps/web/dist", limits.pagesAssetBytes);
await addFileChecks("Worker dry-run bundle", "apps/api/dist", limits.workerBundleBytes, (path) => path.endsWith(".js"));

let failed = false;
for (const check of checks.sort((a, b) => b.bytes - a.bytes)) {
  const ok = check.bytes <= check.limit;
  if (!ok) failed = true;

  console.log(
    `${ok ? "ok" : "fail"} ${check.label}: ${relative(root, check.path)} ${formatBytes(check.bytes)} / ${formatBytes(check.limit)}`
  );
}

if (failed) {
  throw new Error("Cloudflare free-tier artifact limit audit failed.");
}

if (checks.length === 0) {
  throw new Error("No artifacts found to audit. Run npm run build first.");
}

async function addFileChecks(
  label: string,
  directory: string,
  limit: number,
  include: (path: string) => boolean = () => true
) {
  for (const path of await walk(resolve(root, directory))) {
    if (!include(path)) continue;

    const info = await stat(path);
    if (!info.isFile()) continue;

    checks.push({
      label,
      path,
      bytes: info.size,
      limit
    });
  }
}

async function walk(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const paths: string[] = [];

  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      paths.push(...(await walk(path)));
    } else if (entry.isFile()) {
      paths.push(path);
    }
  }

  return paths;
}

function formatBytes(bytes: number): string {
  if (bytes >= mib) return `${(bytes / mib).toFixed(2)} MiB`;
  return `${(bytes / 1024).toFixed(1)} KiB`;
}
