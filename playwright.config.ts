// Browser launch options used by the Cucumber hooks (not a Playwright Test config).
import type { LaunchOptions } from 'playwright';
import { config } from './config/config';

export const browserLaunchOptions: LaunchOptions = {
  headless: config.headless,
  timeout: config.timeoutMs,
};
