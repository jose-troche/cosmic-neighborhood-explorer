import { expect, test } from "@playwright/test";
import { PNG } from "pngjs";

test("app loads with nonblank canvas and tabs", async ({ page }) => {
  test.setTimeout(60_000);

  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Cosmic Neighborhood Explorer" })).toBeVisible();
  await expect(page.getByLabel("Data source freshness")).toContainText(/live|seed/);
  const canvas = page.locator("canvas");
  await expect(canvas).toBeVisible();
  const exoplanetLayer = page.getByRole("button", { name: /Exoplanets/ });
  await expect(exoplanetLayer).toHaveAttribute("aria-pressed", "true");
  await exoplanetLayer.click();
  await expect(exoplanetLayer).toHaveAttribute("aria-pressed", "false");
  await exoplanetLayer.click();
  await expect(exoplanetLayer).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByLabel("Star color meaning")).toBeVisible();
  await page.getByRole("button", { name: "Luminosity" }).click();
  await expect(page.getByRole("button", { name: "Luminosity" })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Motion" }).click();
  await expect(page.getByRole("button", { name: "Motion" })).toHaveAttribute("aria-pressed", "true");

  await page.getByRole("button", { name: /Facts/ }).click();
  await expect(page.getByText("Cosmic Facts")).toBeVisible();
  await expect(page.getByText("Closest Habitable Candidate")).toBeVisible();

  const box = await canvas.boundingBox();
  expect(box).not.toBeNull();
  const viewport = page.viewportSize();
  expect(viewport).not.toBeNull();
  const clip = {
    x: Math.max(0, box!.x),
    y: Math.max(0, box!.y),
    width: Math.min(box!.width, 640, viewport!.width - Math.max(0, box!.x)),
    height: Math.min(box!.height, 420, viewport!.height - Math.max(0, box!.y))
  };
  expect(clip.width).toBeGreaterThan(20);
  expect(clip.height).toBeGreaterThan(20);
  const screenshot = await page.screenshot({
    clip
  });
  const png = PNG.sync.read(screenshot);
  let litPixels = 0;
  for (let index = 0; index < png.data.length; index += 4) {
    if (png.data[index]! + png.data[index + 1]! + png.data[index + 2]! > 40) litPixels += 1;
  }
  expect(litPixels).toBeGreaterThan(25);

  await page.getByRole("button", { name: /Travel/ }).click();
  await expect(page.getByText("What If We Left Today?")).toBeVisible();
  await page.getByRole("button", { name: /10% speed of light/ }).click();
  await expect(page.getByText(/light-years at/)).toBeVisible();
  await expect(page.getByText("80-year lifetime")).toBeVisible();
  await page.getByRole("button", { name: /Worlds/ }).click();
  await expect(page.getByText("Nearby Worlds Race")).toBeVisible();
  await page.getByRole("button", { name: /NEOs/ }).click();
  await expect(page.getByText("Near-Earth Object Watch")).toBeVisible();
  await page.getByRole("button", { name: /Deep Sky/ }).click();
  await expect(page.getByText("Deep Sky Objects")).toBeVisible();
  await page.getByRole("button", { name: /Timeline/ }).click();
  await expect(page.getByText("Planet Discovery Timeline")).toBeVisible();
  await page.getByRole("button", { name: /Density/ }).click();
  await expect(page.getByText("Cosmic Neighborhood Density")).toBeVisible();
});
