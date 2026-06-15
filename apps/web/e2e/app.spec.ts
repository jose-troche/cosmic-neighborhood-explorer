import { expect, test } from "@playwright/test";
import { PNG } from "pngjs";

test("app loads with nonblank canvas and tabs", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Cosmic Neighborhood Explorer" })).toBeVisible();
  await expect(page.locator("canvas")).toBeVisible();

  await page.getByRole("button", { name: /Travel/ }).click();
  await expect(page.getByText("What If We Left Today?")).toBeVisible();
  await page.getByRole("button", { name: /10% speed of light/ }).click();
  await expect(page.getByText(/light-years at/)).toBeVisible();

  const screenshot = await page.locator("canvas").screenshot();
  const png = PNG.sync.read(screenshot);
  let litPixels = 0;
  for (let index = 0; index < png.data.length; index += 4) {
    if (png.data[index]! + png.data[index + 1]! + png.data[index + 2]! > 40) litPixels += 1;
  }
  expect(litPixels).toBeGreaterThan(25);
});
