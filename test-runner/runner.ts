// This runner invokes Cucumber's CLI; Playwright Test is not used to execute scenarios.
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

const cucumberCliPath = resolve(
  process.cwd(),
  'node_modules',
  '@cucumber',
  'cucumber',
  'bin',
  'cucumber.js',
);

if (!existsSync(cucumberCliPath)) {
  throw new Error(`Could not find the Cucumber CLI at ${cucumberCliPath}. Install project dependencies first.`);
}

// With no extra arguments cucumber.js runs every configured feature; supplied paths/tags pass through.
const result = spawnSync(process.execPath, [cucumberCliPath, ...process.argv.slice(2)], {
  cwd: process.cwd(),
  env: process.env,
  stdio: 'inherit',
});

if (result.error) {
  throw result.error;
}

process.exitCode = result.status ?? 1;
