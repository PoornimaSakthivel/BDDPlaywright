// Environment selection and validation are centralized so tests never embed credentials.
import dotenv from 'dotenv';
import { resolve } from 'node:path';
import { chromium, firefox, webkit, type BrowserType } from 'playwright';

const environment = process.env.TEST_ENV ?? 'qa';
if (environment !== 'qa' && environment !== 'uat') {
  throw new Error(`Unsupported TEST_ENV "${environment}". Choose "qa" or "uat".`);
}

const envFilePath = resolve(__dirname, `.env.${environment}`);
// Windows provides a built-in USERNAME variable; let the selected test env file take precedence.
const envResult = dotenv.config({ path: envFilePath, override: true });
if (envResult.error) {
  throw new Error(`Unable to load environment file at ${envFilePath}: ${envResult.error.message}`);
}

function requiredEnvironmentValue(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable ${name} in ${envFilePath}.`);
  }
  return value;
}

const browserName = process.env.BROWSER ?? 'chromium';
const browserTypes: Record<string, BrowserType> = { chromium, firefox, webkit };
const selectedBrowser = browserTypes[browserName];
if (!selectedBrowser) {
  throw new Error(`Unsupported BROWSER "${browserName}". Choose chromium, firefox, or webkit.`);
}

const timeoutMs = Number(process.env.TIMEOUT_MS ?? '30000');
if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) {
  throw new Error(`TIMEOUT_MS must be a positive number; received "${process.env.TIMEOUT_MS}".`);
}

const baseUrl = requiredEnvironmentValue('BASE_URL');
try {
  new URL(baseUrl);
} catch {
  throw new Error(`BASE_URL must be a valid absolute URL; received "${baseUrl}".`);
}

export const config = {
  environment,
  baseUrl,
  username: requiredEnvironmentValue('USERNAME'),
  password: requiredEnvironmentValue('PASSWORD'),
  headless: (process.env.HEADLESS ?? 'true').toLowerCase() !== 'false',
  timeoutMs,
  browserName,
};

export const browserType = selectedBrowser;
