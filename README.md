# Playwright + TypeScript + Cucumber BDD Framework

This project automates SauceDemo login scenarios with Cucumber as the BDD runner and Playwright as the browser automation library. It does not use Playwright Test to execute Cucumber scenarios.

## Project architecture

```text
features/                 Gherkin feature files and tagged scenarios
step-definitions/         Cucumber Given/When/Then implementations
pages/                    Page Object Model classes and UI selectors
hooks/                    Browser setup, scenario isolation, cleanup, screenshots
config/                   Environment selection and QA/UAT dotenv files
test-runner/              TypeScript entry point invoking the Cucumber CLI
utils/                    Reusable framework utilities
reports/                  Generated Cucumber HTML report
screenshots/              Failure screenshots saved as PNG files
cucumber.js               Cucumber feature, support-code, and formatter settings
playwright.config.ts      Browser launch settings used by Cucumber hooks
tsconfig.json             TypeScript compiler settings
package.json              Dependencies and npm scripts
```

## Installation

Use Node.js 20 or newer:

```bash
npm install
npx playwright install chromium
```

Install all supported Playwright browsers with `npx playwright install`. Select the engine with `BROWSER=chromium`, `firefox`, or `webkit` (Chromium is the default).

## Environment configuration

`TEST_ENV=qa` is the default. Set `TEST_ENV=uat` to use `config/.env.uat`. Both example files contain the SauceDemo demo account. Each environment file defines:

```dotenv
BASE_URL=https://www.saucedemo.com/
USERNAME=standard_user
PASSWORD=secret_sauce
```

Copy/update these files for your test environment. The selected file's `BASE_URL`, `USERNAME`, and `PASSWORD` values override ambient values with the same names (Windows, for example, supplies its own `USERNAME`). Keep real secrets out of source control. Optional runtime variables are `BROWSER`, `HEADLESS=true|false`, and `TIMEOUT_MS`.

PowerShell:

```powershell
$env:TEST_ENV = "qa"
npm run test:bdd
$env:TEST_ENV = "uat"
npm run test:bdd
```

## Run tests

Run all feature files:

```bash
npm run test:bdd
```

Run one feature with Cucumber directly:

```bash
npx cucumber-js features/login.feature
```

Run scenarios by tag (the Cucumber equivalent of Playwright Test's `--grep`):

```bash
npm run test:bdd -- --tags "@smoke"
npm run test:bdd -- --tags "@regression"
```

The direct CLI works too: `npx cucumber-js --tags "@smoke"`.

Run in headed mode:

```bash
npm run test:bdd:headed
```

## HTML report and failure screenshots

Every Cucumber run writes `reports/cucumber-report.html`, including feature/scenario/step results, execution durations, failure messages, and attached failure screenshots. The `After` hook takes a full-page screenshot for failed scenarios, stores the PNG in `screenshots/`, attaches its bytes to the scenario, and closes the page, context, and browser in a `finally` block. Cucumber continues to the other scenarios according to its normal execution behavior.

## How it works

1. Cucumber reads a feature file and selects scenarios, optionally filtering by tags.
2. The `Before` hook launches the configured browser and creates an isolated `BrowserContext` and `Page`.
3. Cucumber maps each Gherkin step to a matching function in `step-definitions/login.steps.ts`.
4. Step functions call `LoginPage`; that page object owns selectors and browser interactions.
5. Playwright drives the browser against the selected environment's base URL.
6. On failure, the `After` hook captures and attaches a screenshot, then closes browser resources.
7. Cucumber writes the HTML report.

```text
Feature File
     ↓
Cucumber
     ↓
Step Definition
     ↓
Page Object
     ↓
Playwright
     ↓
Browser
     ↓
Application
     ↓
Cucumber Report
```

## Beginner's glossary

- **Feature file / Gherkin:** Human-readable behavior descriptions using `Feature`, `Scenario`, `Given`, `When`, and `Then`.
- **Step definitions:** TypeScript implementations of the Gherkin steps.
- **Page Object Model:** A pattern that groups page selectors and UI actions into reusable classes.
- **Hooks:** Cucumber lifecycle functions for scenario setup and teardown.
- **Browser:** The Playwright-controlled browser engine, such as Chromium.
- **BrowserContext:** An isolated session with its own cookies and storage; this framework creates one per scenario.
- **Playwright Page:** A browser tab used for navigation, locators, and interaction.
- **Cucumber runner/reporting:** The Cucumber CLI runs scenarios and its HTML formatter presents results and attachments.
