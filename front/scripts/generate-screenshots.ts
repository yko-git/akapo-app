import { chromium } from "playwright";
import { screens } from "./screens.config";
import fs from "fs";

const BASE_URL = "http://localhost:3000";

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  fs.mkdirSync("docs/screens", { recursive: true });

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
