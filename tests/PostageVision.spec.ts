import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { PostageVisionPage } from '../pages/PostageVisionPage';
import users from '../test_data/Logindata.json';

test('Validate latest record based on local date', async ({ page }) => {

  test.setTimeout(240000);

  const loginPage = new LoginPage(page);
  const pvPage = new PostageVisionPage(page);

  const user = users[0];

  // 🔹 Step 1: Navigate to Dev + Login
  await loginPage.gotoLoginPage();
  await loginPage.login(user.username, user.password);

  // 🔹 Step 2: Wait for page load
  await page.waitForLoadState('networkidle');

  //🔹 Step 3: Postage Vision Option
   await pvPage.clickPostageVisionOption();

  // 🔹 Step 4: Click Details tab
  await pvPage.clickDetailsTab();

  await page.waitForTimeout(5000);

  // 🔹 Step 5: Get first record date
  const recordDateTime = await pvPage.getFirstRecordDate();

  console.log("First Record DateTime:", recordDateTime);

  // 🔹 Step 5: Compare with local system date
  const recordDateObj = new Date(recordDateTime);
  const localDateObj = new Date();

  const isSameDate =
    recordDateObj.getFullYear() === localDateObj.getFullYear() &&
    recordDateObj.getMonth() === localDateObj.getMonth() &&
    recordDateObj.getDate() === localDateObj.getDate();

  // 🔹 Step 6: Logs
  if (isSameDate) {
    console.log(`✅ Records are updated. Latest record: ${recordDateTime}`);
  } else {
    console.log(`❌ Records are NOT latest.`);
    console.log(`UI Date: ${recordDateTime}`);
    console.log(`Expected: ${localDateObj.toISOString().split('T')[0]}`);
  }

  // 🔹 Step 7: Assertion
  expect(isSameDate).toBeTruthy();
});