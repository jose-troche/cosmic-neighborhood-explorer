import { describe, expect, it } from "vitest";
import { configureWranglerText } from "./configure-cloudflare";

const baseWrangler = `name = "cosmic-neighborhood-api"
main = "src/index.ts"
compatibility_date = "2026-06-14"

[vars]
BUILD_VERSION = "local"

[[kv_namespaces]]
binding = "COSMIC_CACHE"
id = "replace-with-production-kv-namespace-id"
preview_id = "replace-with-preview-kv-namespace-id"
`;

describe("configureWranglerText", () => {
  it("replaces KV IDs and inserts the account ID", () => {
    const configured = configureWranglerText(baseWrangler, {
      accountId: "account-123",
      kvNamespaceId: "kv-prod-123",
      kvPreviewNamespaceId: "kv-preview-123"
    });

    expect(configured).toContain('account_id = "account-123"');
    expect(configured).toContain('id = "kv-prod-123"');
    expect(configured).toContain('preview_id = "kv-preview-123"');
    expect(configured).not.toContain("replace-with-production-kv-namespace-id");
  });

  it("defaults preview KV ID to the production KV ID", () => {
    const configured = configureWranglerText(baseWrangler, {
      kvNamespaceId: "kv-prod-123"
    });

    expect(configured).toContain('id = "kv-prod-123"');
    expect(configured).toContain('preview_id = "kv-prod-123"');
    expect(configured).not.toContain("account_id");
  });

  it("fails when the expected KV namespace lines are missing", () => {
    expect(() =>
      configureWranglerText('name = "cosmic-neighborhood-api"\n', {
        kvNamespaceId: "kv-prod-123"
      })
    ).toThrow(/Could not find id/);
  });
});
