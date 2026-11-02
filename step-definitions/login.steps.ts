// Step definitions connect readable Gherkin steps to reusable page-object methods.
import { Given, When, Then } from '@cucumber/cucumber';
import assert from 'node:assert/strict';
import { config } from '../config/config';
import { CustomWorld } from '../hooks/hooks';

Given('I navigate to the login page', async function (this: CustomWorld) {
  await this.loginPage.navigateToLoginPage();
});

When('I enter valid username and password', async function (this: CustomWorld) {
  await this.loginPage.enterUsername(config.username);
  await this.loginPage.enterPassword(config.password);
});

When('I enter invalid username and password', async function (this: CustomWorld) {
  await this.loginPage.enterUsername(`invalid_${config.username}`);
  await this.loginPage.enterPassword(`${config.password}_invalid`);
});

When('I click the login button', async function (this: CustomWorld) {
  await this.loginPage.clickLogin();
});

Then('I should be successfully logged in', async function (this: CustomWorld) {
  await this.loginPage.verifySuccessfulLogin();
});

Then('I should see a login error', async function (this: CustomWorld) {
  const errorMessage = await this.loginPage.verifyLoginError();
  assert.match(errorMessage, /username and password do not match/i);
});
