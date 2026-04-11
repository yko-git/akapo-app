import { chromium } from "@playwright/test";
import fs from "fs";
import path from "path";

const BASE_URL = "http://localhost:3000";

const sourceDataPath = path.resolve(
  __dirname,
  "../../../tmp/feature-sources.json",
);
const sourceData = JSON.parse(fs.readFileSync(sourceDataPath, "utf-8"));

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const outputDir = path.resolve(process.cwd(), "docs/screens");
  fs.mkdirSync(outputDir, { recursive: true });

  // ログイン
  await page.goto(BASE_URL + "/login");

  await page.getByLabel("ログインID").fill("test");
  await page.getByLabel("パスワード").fill("ps");

  await page.getByRole("button", { name: "ログイン" }).click();

  await page.waitForURL("**/mypage");

  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(500);

  console.log("✅ logged in");

  for (const screen of sourceData.features) {
    if (!screen.route) continue;

    const route = screen.route;

    await page.goto(BASE_URL + route, {
      waitUntil: "networkidle",
    });

    const filePath = path.join(outputDir, `${screen.id}.png`);

    await page.screenshot({
      path: filePath,
      fullPage: true,
    });

    console.log("generated:", filePath);
  }

  await browser.close();
})();
