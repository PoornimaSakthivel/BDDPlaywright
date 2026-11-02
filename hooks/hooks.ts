// Hooks prepare and clean up one isolated browser session for every scenario.
import {
  After,
  Before,
  Status,
  World,
  setDefaultTimeout,
  setWorldConstructor,
  type IWorldOptions,
} from '@cucumber/cucumber';
import type { Browser, BrowserContext, Page } from 'playwright';
import { browserType, config } from '../config/config';
import { browserLaunchOptions } from '../playwright.config';
import { LoginPage } from '../pages/LoginPage';
import { createFailureScreenshotPath } from '../utils/screenshot';

setDefaultTimeout(config.timeoutMs);

export class CustomWorld extends World {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;
  loginPage!: LoginPage;

  constructor(options: IWorldOptions) {
    super(options);
  }
}

setWorldConstructor(CustomWorld);

Before(async function (this: CustomWorld) {
  // Browser is the browser engine; BrowserContext isolates cookies and storage per scenario.
  this.browser = await browserType.launch(browserLaunchOptions);
  this.context = await this.browser.newContext();
  this.page = await this.context.newPage();
  this.loginPage = new LoginPage(this.page);
});

After(async function (this: CustomWorld, { result, pickle }) {
  try {
    if (result?.status === Status.FAILED && this.page && !this.page.isClosed()) {
      const screenshotPath = createFailureScreenshotPath(pickle.name);
      try {
        const screenshot = await this.page.screenshot({ path: screenshotPath, fullPage: true });
        await this.attach(screenshot, 'image/png');
        console.error(`Failure screenshot saved to ${screenshotPath}`);
      } catch (error) {
        console.error(`Could not capture or attach the failure screenshot: ${String(error)}`);
      }
    }
  } finally {
    const resources = [
      ['page', this.page],
      ['context', this.context],
      ['browser', this.browser],
    ] as const;

    for (const [resourceName, resource] of resources) {
      if (resource) {
        try {
          await resource.close();
        } catch (error) {
          console.error(`Could not close the Playwright ${resourceName}: ${String(error)}`);
        }
      }
    }
  }
});
