import { test, expect } from '@playwright/test';
import { readExcel } from '../Utils/excelReader';

const testData = readExcel('users.xlsx', 'Users') as any[];

test.describe('Login with Excel Data', () => {

  for (const data of testData) {

    test(`Login test for ${data.username}`, async ({ page }) => {

      await page.goto('https://dev-compuintelligence.compumailinc.com/');

      await page.fill('#Username', data.username);
      await page.fill('#Password', data.password);
      await page.click('#btnLogin');

      await expect(page).toHaveURL(
        'https://dev-compuintelligence.compumailinc.com/Home/Index'
      );
    });

  }

});