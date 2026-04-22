import { Page } from '@playwright/test';
import * as fs from 'fs';

export class LeftMenuPage {

  constructor(private page: Page) {}

  // ✅ Soft dynamic wait (never breaks test)
  async waitForPageReady(menuName: string) {

    console.log(`Waiting for page to fully load: ${menuName}`);

    try {
      // 🔹 Basic load states
      await this.page.waitForLoadState('domcontentloaded');
      await this.page.waitForLoadState('networkidle');

      // 🔹 Wait for loader/spinner to disappear
      const loaders = ['.loader', '.spinner', '.loading'];

      for (const loader of loaders) {
        try {
          await this.page.waitForSelector(loader, {
            state: 'hidden',
            timeout: 3000
          });
        } catch {
          // Ignore if loader not found
        }
      }

      // 🔹 Page-specific selectors (add more if needed)
      const pageSelectors: { [key: string]: string } = {
        Dashboard: '#dashboardContainer',
        My_Client: '#clientGrid',
        Reports: '#reportTable'
      };

      const selector = pageSelectors[menuName];

      if (selector) {
        console.log(`Waiting for specific element: ${selector}`);
        await this.page.waitForSelector(selector, {
          state: 'visible',
          timeout: 10000
        });
      } else {
        // 🔹 Generic fallback (SAFE - will not fail)
        await this.page.waitForSelector(
          'h1, h2, table, .grid, .card, .container',
          {
            state: 'visible',
            timeout: 5000
          }
        ).catch(() => {
          console.log(`No common UI found for ${menuName}, continuing...`);
        });
      }

    } catch (err) {
      console.log(`Soft wait fallback used for ${menuName}`);
    }

    // 🔹 Small stabilization delay
    await this.page.waitForTimeout(1000);
  }

  async clickAllMenusAndCapture() {

    const homeURL = "https://dev-compuintelligence.compumailinc.com/Home";
    const menuLocator = '#menu-top-menu li.menu-item a';

    // Wait for menu items
    await this.page.waitForSelector(menuLocator);

    const menus = this.page.locator(menuLocator);
    const menuCount = await menus.count();

    console.log("Total menus:", menuCount);

    // Capture menu names first
    const menuNames = await menus.allTextContents();

    // Create screenshot folder
    const folder = "screenshots";
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder);
    }

    for (let i = 0; i < menuCount; i++) {

      const rawText = menuNames[i];

      const text = rawText
        .trim()
        .replace(/\s+/g, "_")
        .replace(/[^a-zA-Z0-9_]/g, "");

      console.log(`\nClicking menu ${i + 1}: ${text}`);

      const menu = this.page.locator(menuLocator).nth(i);

      try {
        // 🔹 Click menu
        await menu.click();

        // 🔹 Wait dynamically (SAFE)
        await this.waitForPageReady(text);

      } catch (error) {
        console.log(`Issue while loading ${text}:`, error);
      }

      // ✅ ALWAYS take screenshot (even if wait fails)
      try {
        await this.page.screenshot({
          path: `${folder}/${text}.png`,
          fullPage: true
        });

        console.log(`Screenshot saved: ${text}.png`);
      } catch (err) {
        console.log(`Screenshot failed for ${text}:`, err);
      }

      // 🔹 Navigate back to home
      await this.page.goto(homeURL);

      // 🔹 Ensure home page is ready
      await this.page.waitForLoadState('domcontentloaded');
      await this.page.waitForLoadState('networkidle');
    }
  }
}