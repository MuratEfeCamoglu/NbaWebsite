import { expect, test } from "@playwright/test";

test("home page renders in Turkish with all 30 team badges", async ({
  page,
}) => {
  await page.goto("/");

  await expect(page.locator("html")).toHaveAttribute("lang", "tr");
  await expect(page).toHaveTitle("NBA Sezon Öncesi Tahmin");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "SEZON BAŞLAMADAN FİKRİNİ KAYDET",
  );
  await expect(page.getByRole("img")).toHaveCount(30);
  await expect(page.getByRole("img", { name: "Boston Celtics" })).toHaveText(
    "BOS",
  );
});

test("lock time is shown in Turkey time", async ({ page }) => {
  await page.goto("/");

  const lock = page.locator("time");
  await expect(lock).toHaveAttribute("datetime", "2026-10-20T19:00:00Z");
  await expect(lock).toContainText("20 Ekim 2026");
  await expect(lock).toContainText("22:00");
});

for (const width of [1440, 1280, 768]) {
  test(`no horizontal scroll at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");

    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    expect(overflow).toBe(0);
  });
}

test("has no links to other sites", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator('a[href^="http"]')).toHaveCount(0);
});
