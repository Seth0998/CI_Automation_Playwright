import { test, expect } from '@playwright/test';

test('Open Dev Environment and Login with Valid credentails', async ({ page }) => {
  await page.goto('https://dev-compuintelligence.compumailinc.com/');
  await page.locator("#Username").fill("rachel_spa1");
  await page.locator("#Password").fill("devv@1234567");
  await page.locator("#btnLogin").click();

  // 3. Wait for navigation after login
  await page.waitForLoadState('networkidle');

  const actualTitle = await page.title();
  const expectedTitle = 'Welcome to Compu Intelligence';

  if (actualTitle === expectedTitle) {
    console.log('Login successful');
  } else {
    console.log('Login failed');
    throw new Error('Wrong page title after login');
  }

});