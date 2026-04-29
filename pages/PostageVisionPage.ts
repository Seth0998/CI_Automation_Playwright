import { Page, Locator } from '@playwright/test';

export class PostageVisionPage {
  readonly page: Page;
  readonly postageVisionOption: Locator;
  readonly detailsTab: Locator;
  readonly firstRowDate: Locator;

  constructor(page: Page) {
    this.page = page;

    // Locators
    this.postageVisionOption = page.locator("//div[text()='Postage Vision']");

    this.detailsTab = page.locator("//li[@id='pstDetails']//a[text()='Details']");
    this.firstRowDate = page.locator("//tbody/tr[1]/td[@data-field='dateOfPostage']");
  }

  // Method to click Postage Option
  async clickPostageVisionOption() {
    await this.page.waitForLoadState('networkidle');

    await this.page.waitForSelector("//div[text()='Postage Vision']", { timeout: 60000 });

    await this.postageVisionOption.click();
  }
//Methos to click Details Tab
  async clickDetailsTab() {
    await this.page.waitForLoadState('networkidle');

    await this.page.waitForSelector("//li[@id='pstDetails']//a[text()='Details']", { timeout: 60000 });

    await this.detailsTab.click();
  }

  async getFirstRecordDate(): Promise<string> {
    await this.firstRowDate.waitFor({ state: 'visible' });
    return (await this.firstRowDate.textContent())?.trim() || '';
  }
}