import { expect, test, type Page } from "@playwright/test";

function rankingList(page: Page, conference: "Batı" | "Doğu") {
  return page.getByRole("list", {
    name: `${conference} konferansı sıralaması`,
  });
}

async function order(page: Page, conference: "Batı" | "Doğu") {
  return rankingList(page, conference).getByRole("img").allTextContents();
}

const MOVE_BOS_UP = "Boston Celtics takımını bir sıra yukarı taşı";

test.describe("sıralama", () => {
  test("shows two separate lists of 15, alphabetical at first", async ({
    page,
  }) => {
    await page.goto("/siralama");

    await expect(rankingList(page, "Batı").getByRole("listitem")).toHaveCount(
      15,
    );
    await expect(rankingList(page, "Doğu").getByRole("listitem")).toHaveCount(
      15,
    );
    expect((await order(page, "Doğu")).slice(0, 3)).toEqual([
      "ATL",
      "BOS",
      "BKN",
    ]);
    await expect(page.getByText("Henüz sıralama yapmadın")).toBeVisible();
  });

  test("reorders with the arrow buttons and keeps the order after reload", async ({
    page,
  }) => {
    await page.goto("/siralama");

    await page.getByRole("button", { name: MOVE_BOS_UP }).click();
    expect((await order(page, "Doğu")).slice(0, 2)).toEqual(["BOS", "ATL"]);
    await expect(page.getByText("Sıralaman kaydedildi.")).toBeVisible();
    await expect(
      page.getByRole("button", { name: MOVE_BOS_UP }),
    ).toBeDisabled();

    await page.reload();
    await expect
      .poll(async () => (await order(page, "Doğu")).slice(0, 2))
      .toEqual(["BOS", "ATL"]);
    // The other conference is untouched.
    expect((await order(page, "Batı"))[0]).toBe("DAL");
  });

  test("reorders with the keyboard", async ({ page }) => {
    await page.goto("/siralama");

    await page
      .getByRole("button", { name: "Dallas Mavericks takımını sürükle" })
      .focus();
    // dnd-kit announces each step; wait for it before pressing the next key.
    await page.keyboard.press("Space");
    await expect(
      page.getByText(/Dallas Mavericks (tutuldu|1\. sıraya)/),
    ).toBeAttached();
    await page.keyboard.press("ArrowDown");
    await expect(
      page.getByText("Dallas Mavericks 2. sıraya taşındı."),
    ).toBeAttached();
    await page.keyboard.press("Space");

    await expect
      .poll(async () => (await order(page, "Batı")).slice(0, 2))
      .toEqual(["DEN", "DAL"]);
  });

  test("reorders by dragging with the mouse", async ({ page }) => {
    await page.goto("/siralama");

    const handle = page.getByRole("button", {
      name: "Atlanta Hawks takımını sürükle",
    });
    const target = page.getByRole("button", {
      name: "Brooklyn Nets takımını sürükle",
    });
    const from = (await handle.boundingBox())!;
    const to = (await target.boundingBox())!;
    await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2);
    await page.mouse.down();
    await page.mouse.move(to.x + to.width / 2, to.y + to.height / 2 + 8, {
      steps: 12,
    });
    await page.mouse.up();

    await expect
      .poll(async () => (await order(page, "Doğu")).slice(0, 3))
      .toEqual(["BOS", "BKN", "ATL"]);
  });
});

test.describe("alt / üst", () => {
  test("numbers each conference 1–15 using the saved ranking", async ({
    page,
  }) => {
    await page.goto("/siralama");
    await page.getByRole("button", { name: MOVE_BOS_UP }).click();
    await page.getByRole("link", { name: /GEÇ/ }).click();
    await expect(page).toHaveURL(/\/alt-ust$/);

    for (const conference of ["BATI", "DOĞU"]) {
      const section = page.getByRole("region", { name: conference });
      const rows = section.locator("li[data-team]");
      await expect(rows).toHaveCount(15);
      await expect(rows.first().locator("div").nth(1)).toHaveText("1");
      await expect(rows.last().locator("div").nth(1)).toHaveText("15");
    }
    await expect(
      page
        .getByRole("region", { name: "DOĞU" })
        .locator("li[data-team]")
        .first(),
    ).toHaveAttribute("data-team", "BOS");
  });

  test("picks a side, sets confidence and keeps them after reload", async ({
    page,
  }) => {
    await page.goto("/alt-ust");

    const row = page.locator('li[data-team="BOS"]');
    const over = row.getByRole("button", { name: "ÜST" });
    const stars = row.getByRole("group", { name: /güven puanı/ });
    const star = (level: number) =>
      stars.getByRole("button", { name: `Güven ${level} / 3` });

    await expect(star(1)).toBeDisabled();
    await over.click();
    await expect(over).toHaveAttribute("aria-pressed", "true");
    await expect(star(1)).toHaveAttribute("aria-pressed", "true");
    await star(3).click();
    await expect(page.getByText("/ 30 takım seçildi")).toContainText("1");

    await page.reload();
    await expect(over).toHaveAttribute("aria-pressed", "true");
    await expect(star(3)).toHaveAttribute("aria-pressed", "true");
  });

  test("updates the total and warns about a contradicting projection", async ({
    page,
  }) => {
    await page.goto("/alt-ust");

    const total = page.getByTestId("win-total");
    const before = Number(await total.textContent());

    const row = page.locator('li[data-team="BOS"]');
    await row.getByRole("button", { name: "ÜST" }).click();
    await expect(total).toHaveText(String(before + 1));

    await row.getByRole("spinbutton").fill("10");
    await expect(row.getByText("Tutarsız seçim:")).toBeVisible();
    await expect(row).toContainText("Üst seçtin ama tahminin (10)");
    await expect(page.getByText("SAPMA YÜKSEK")).toBeVisible();

    await row.getByRole("spinbutton").fill("");
    await expect(row.getByText("Tutarsız seçim:")).toHaveCount(0);
    await expect(page.getByText("DENGEDE")).toBeVisible();
  });

  test("filters by conference", async ({ page }) => {
    await page.goto("/alt-ust");

    await expect(page.locator("li[data-team]")).toHaveCount(30);
    await page.getByRole("button", { name: /^DOĞU/ }).click();
    await expect(page.locator("li[data-team]")).toHaveCount(15);
    await expect(page.locator('li[data-team="LAL"]')).toHaveCount(0);
  });

  for (const width of [1440, 1280, 768]) {
    test(`no horizontal scroll at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      for (const path of ["/siralama", "/alt-ust"]) {
        await page.goto(path);
        const overflow = await page.evaluate(
          () =>
            document.documentElement.scrollWidth -
            document.documentElement.clientWidth,
        );
        expect(overflow, path).toBe(0);
      }
    });
  }
});
