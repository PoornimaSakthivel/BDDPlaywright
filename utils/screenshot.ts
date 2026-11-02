// Failure screenshots use scenario names that are safe to store as file names.
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

export function createFailureScreenshotPath(scenarioName: string): string {
  const screenshotDirectory = resolve(process.cwd(), 'screenshots');
  mkdirSync(screenshotDirectory, { recursive: true });

  const safeScenarioName = scenarioName
    .replace(/[^a-zA-Z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'scenario';
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  return resolve(screenshotDirectory, `failure-${safeScenarioName}-${timestamp}.png`);
}
