import { Page } from '@playwright/test';

export class LoginPage {

  constructor(private page: Page) {}

  async gotoLoginPage() {
    await this.page.goto('https://dev-compuintelligence.compumailinc.com/');
  }

  async login(username: string, password: string) {
    await this.page.fill('#Username', username);
    await this.page.fill('#Password', password);
    await this.page.click('#btnLogin');
  }
}