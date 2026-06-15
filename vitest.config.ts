import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    exclude: ["**/node_modules/**", "**/dist/**", "apps/web/e2e/**"],
    globals: true,
    include: ["apps/**/*.{test,spec}.ts?(x)", "packages/**/*.{test,spec}.ts?(x)", "scripts/**/*.{test,spec}.ts"],
    setupFiles: ["./vitest.setup.ts"]
  }
});
