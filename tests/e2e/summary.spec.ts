import { readFile } from "node:fs/promises";
import { expect, test } from "@playwright/test";

test.describe("özet", () => {
  test("shows the ranking and picks made on the earlier steps", async ({
    page,
  }) => {
    await page.goto("/siralama");
    await page
      .getByRole("button", {
        name: "Boston Celtics takımını bir sıra yukarı taşı",
      })
      .click();
    await page.getByRole("link", { name: /GEÇ/ }).click();

    const picksRow = page.locator('li[data-team="BOS"]');
    await picksRow.getByRole("button", { name: "ÜST" }).click();
    await picksRow.getByRole("button", { name: "Güven 3 / 3" }).click();
    await picksRow.getByRole("spinbutton").fill("60");
    await page.getByRole("link", { name: "ÖZETE GEÇ" }).click();
    await expect(page).toHaveURL(/\/ozet$/);

    const east = page.getByRole("region", { name: "DOĞU" });
    const first = east.locator("li[data-team]").first();
    await expect(first).toHaveAttribute("data-team", "BOS");
    await expect(first).toContainText("ÜST");
    await expect(first).toContainText("60");
    await expect(first.getByRole("img", { name: "Güven 3 / 3" })).toBeVisible();
    await expect(east.locator("li[data-team]")).toHaveCount(15);
    await expect(
      page.getByRole("region", { name: "BATI" }).locator("li[data-team]"),
    ).toHaveCount(15);
    await expect(
      page.getByText("29 takım için Alt/Üst seçmedin"),
    ).toBeVisible();
  });

  test("lists contradicting picks under the warnings", async ({ page }) => {
    await page.goto("/alt-ust");
    const row = page.locator('li[data-team="BOS"]');
    await row.getByRole("button", { name: "ALT" }).click();
    await row.getByRole("spinbutton").fill("70");

    await page.goto("/ozet");
    const warnings = page.getByRole("region", { name: "GÖZDEN GEÇİR" });
    await expect(warnings).toContainText("Boston Celtics: Alt seçtin");
    await expect(warnings).toContainText("Henüz sıralama yapmadın");
  });

  test("downloads the prediction as a PNG image", async ({ page }) => {
    await page.goto("/alt-ust");
    await page
      .locator('li[data-team="OKC"]')
      .getByRole("button", { name: "ÜST" })
      .click();
    await page.goto("/ozet");

    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.getByRole("button", { name: "TÜMÜNÜ İNDİR" }).click(),
    ]);

    expect(download.suggestedFilename()).toBe("nba-tahmin-2026-27.png");
    const file = await readFile((await download.path())!);
    // PNG signature + IHDR width of 1600 px
    expect(file.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
    expect(file.readUInt32BE(16)).toBe(1600);
    expect(file.length).toBeGreaterThan(50_000);
  });

  for (const width of [1440, 1280, 768]) {
    test(`no horizontal scroll at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/ozet");
      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      );
      expect(overflow).toBe(0);
    });
  }
});

test.describe("mobil", () => {
  test.use({
    viewport: { width: 360, height: 740 },
    hasTouch: true,
    isMobile: true,
  });

  for (const path of ["/", "/siralama", "/alt-ust", "/ozet"]) {
    test(`no horizontal overflow on ${path}`, async ({ page }) => {
      await page.goto(path);
      const clipped = await page.evaluate(() => {
        const width = document.documentElement.clientWidth;
        return [...document.querySelectorAll("button, input, a")].filter(
          (el) => el.getBoundingClientRect().right > width + 1,
        ).length;
      });
      expect(clipped).toBe(0);
    });
  }

  test("picks controls stay reachable on a phone", async ({ page }) => {
    await page.goto("/alt-ust");
    const row = page.locator('li[data-team="BOS"]');
    await row.getByRole("button", { name: "ÜST" }).click();
    await row.getByRole("button", { name: "Güven 3 / 3" }).click();
    await row.getByRole("spinbutton").fill("55");
    await expect(row.getByRole("spinbutton")).toHaveValue("55");
  });

  test("opens a preview to save the image", async ({ page }) => {
    await page.goto("/ozet");
    await page.getByRole("button", { name: "TÜMÜNÜ İNDİR" }).click();
    const dialog = page.getByRole("dialog", { name: "TAHMİNİM" });
    await expect(dialog.getByRole("img", { name: "TAHMİNİM" })).toBeVisible();

    const [download] = await Promise.all([
      page.waitForEvent("download"),
      dialog.getByRole("link", { name: /İNDİR/ }).click(),
    ]);
    expect(download.suggestedFilename()).toBe("nba-tahmin-2026-27.png");

    await dialog.getByRole("button", { name: "Önizlemeyi kapat" }).click();
    await expect(dialog).toBeHidden();
  });

  test("shows why the image failed instead of doing nothing", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      HTMLCanvasElement.prototype.toBlob = function (callback) {
        callback(null);
      };
    });
    await page.goto("/ozet");
    await page.getByRole("button", { name: "TÜMÜNÜ İNDİR" }).click();

    const alert = page.getByRole("dialog").getByRole("alert");
    await expect(alert).toContainText("Resim oluşturulamadı");
    await expect(alert).toContainText("PNG export failed");
    await expect(
      alert.getByRole("button", { name: "TEKRAR DENE" }),
    ).toBeVisible();
  });
});
