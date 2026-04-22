import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import users from '../test_data/Logindata.json';

test('Login with valid credentials', async ({ page }) => {

  // Create Page Object
  const loginPage = new LoginPage(page);

  // Get test data
  const user = users[0];

  // Call page methods
  await loginPage.gotoLoginPage();
  await loginPage.login(user.username, user.password);

  // Wait for navigation after login
  await page.waitForLoadState('networkidle');

  // Validation
  await expect(page).toHaveTitle(new RegExp(user.expectedtitle, 'i'));

});