import { chromium } from "playwright";
import { screens } from "./screens.config";
import fs from "fs";

const BASE_URL = "http://localhost:3000";

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  fs.mkdirSync("docs/screens", { recursive: true });

  // ログイン
  await page.goto(BASE_URL + "/login");

  await page.getByLabel("ログインID").fill("test");
  await page.getByLabel("パスワード").fill("ps");

  await page.getByRole("button", { name: "ログイン" }).click();

  // ログイン完了待機
  await page.waitForURL("**/mypage");

  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(500);

  console.log("✅ logged in");

  for (const screen of screens) {
    if (!screen.route) continue;

    const route = screen.screenshotRoute ?? screen.route;

    await page.goto(BASE_URL + route, {
      waitUntil: "networkidle",
    });

    const path = `docs/screens/${screen.id}.png`;

    await page.screenshot({
      path,
      fullPage: true,
    });

    console.log("generated:", path);
  }

  await browser.close();
})();
