import { readFile } from "node:fs/promises";
import { expect, test, type Page } from "@playwright/test";

async function downloadImage(page: Page, buttonName: string) {
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: buttonName, exact: true }).click(),
  ]);
  const file = await readFile((await download.path())!);
  expect(file.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
  return {
    name: download.suggestedFilename(),
    width: file.readUInt32BE(16),
    height: file.readUInt32BE(20),
  };
}

test.describe("grup görünümü", () => {
  test("lists teams in six groups of five and remembers the choice", async ({
    page,
  }) => {
    await page.goto("/alt-ust");
    await expect(page.getByRole("region")).toHaveCount(2);

    await page.getByRole("button", { name: "GRUPLAR" }).click();
    await expect(page.getByRole("region")).toHaveCount(6);
    for (const group of [
      "KUZEYBATI",
      "PASİFİK",
      "GÜNEYBATI",
      "ATLANTİK",
      "MERKEZ",
      "GÜNEYDOĞU",
    ]) {
      await expect(
        page.getByRole("region", { name: group }).locator("li[data-team]"),
      ).toHaveCount(5);
    }
    await expect(
      page
        .getByRole("region", { name: "ATLANTİK" })
        .locator('li[data-team="BOS"]'),
    ).toHaveCount(1);

    // The conference filter still applies on top of the grouping.
    await page.getByRole("button", { name: /^DOĞU/ }).click();
    await expect(page.getByRole("region")).toHaveCount(3);

    await page.goto("/ozet");
    await expect(page.getByRole("button", { name: "GRUPLAR" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await expect(
      page.getByRole("region", { name: "PASİFİK" }).locator("li[data-team]"),
    ).toHaveCount(5);

    await page.getByRole("button", { name: "KONFERANS", exact: true }).click();
    await expect(
      page.getByRole("region", { name: "BATI" }).locator("li[data-team]"),
    ).toHaveCount(15);
  });
});

test.describe("ayrı ayrı indirme", () => {
  test("downloads the ranking, the picks and everything as separate images", async ({
    page,
  }) => {
    await page.goto("/ozet");

    const ranking = await downloadImage(page, "SIRALAMAYI İNDİR");
    const picks = await downloadImage(page, "ALT / ÜST'Ü İNDİR");
    const all = await downloadImage(page, "TÜMÜNÜ İNDİR");

    expect(ranking.name).toBe("nba-siralama-2026-27.png");
    expect(picks.name).toBe("nba-alt-ust-2026-27.png");
    expect(all.name).toBe("nba-tahmin-2026-27.png");
    // The ranking image has no pick columns, so it is the narrowest.
    expect(ranking.width).toBeLessThan(picks.width);
    expect(picks.width).toBeLessThan(all.width);
  });

  test("offers the matching download on the ranking and picks pages", async ({
    page,
  }) => {
    await page.goto("/siralama");
    expect((await downloadImage(page, "SIRALAMAYI İNDİR")).name).toBe(
      "nba-siralama-2026-27.png",
    );

    await page.goto("/alt-ust");
    expect((await downloadImage(page, "ALT / ÜST'Ü İNDİR")).name).toBe(
      "nba-alt-ust-2026-27.png",
    );
  });

  test("the image follows the chosen grouping", async ({ page }) => {
    await page.goto("/ozet");
    const byConference = await downloadImage(page, "TÜMÜNÜ İNDİR");

    await page.getByRole("button", { name: "GRUPLAR" }).click();
    const byGroup = await downloadImage(page, "TÜMÜNÜ İNDİR");

    // Three titled tables per column instead of one makes the image taller.
    expect(byGroup.height).toBeGreaterThan(byConference.height);
    expect(byGroup.width).toBe(byConference.width);
  });
});
