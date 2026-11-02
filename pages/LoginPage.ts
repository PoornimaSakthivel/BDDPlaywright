// The Page Object Model keeps selectors and UI behavior out of step definitions.
import assert from 'node:assert/strict';
import type { Page, Locator } from 'playwright';
import { config } from '../config/config';

export class LoginPage {
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly inventoryList: Locator;
  private readonly errorMessage: Locator;

  constructor(private readonly page: Page) {
    this.usernameInput = page.locator('#user-name');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('#login-button');
    this.inventoryList = page.locator('.inventory_list');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  async navigateToLoginPage(): Promise<void> {
    await this.page.goto(config.baseUrl, { waitUntil: 'domcontentloaded' });
  }

  async enterUsername(username: string): Promise<void> {
    await this.usernameInput.fill(username);
  }

  async enterPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async clickLogin(): Promise<void> {
    await this.loginButton.click();
  }

  async verifySuccessfulLogin(): Promise<void> {
    await this.page.waitForURL('**/inventory.html', { timeout: config.timeoutMs });
    await this.inventoryList.waitFor({ state: 'visible', timeout: config.timeoutMs });
    assert.ok((await this.inventoryList.locator('.inventory_item').count()) > 0,
      'The inventory page should contain at least one product.');
  }

  async verifyLoginError(): Promise<string> {
    await this.errorMessage.waitFor({ state: 'visible', timeout: config.timeoutMs });
    const message = (await this.errorMessage.innerText()).trim();
    assert.notEqual(message, '', 'The login error should include a message.');
    return message;
  }
}
