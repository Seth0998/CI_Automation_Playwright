import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { LeftMenuPage } from '../pages/LeftMenuPage';
import users from '../test_data/Logindata.json';

test('Click all left menu options', async ({ page }) => {

  // ✅ Increase timeout for full execution
  test.setTimeout(240000);

  const loginPage = new LoginPage(page);
  const leftMenu = new LeftMenuPage(page);

  const user = users[0];

  // 🔹 Login
  await loginPage.gotoLoginPage();
  await loginPage.login(user.username, user.password);

  // 🔹 Ensure landing page fully loads
  await page.waitForLoadState('networkidle');

  // 🔹 Execute menu navigation + screenshots
  await leftMenu.clickAllMenusAndCapture();
});