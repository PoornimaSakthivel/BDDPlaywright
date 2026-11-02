// Cucumber loads the hooks and TypeScript definitions, then writes an HTML report.
module.exports = {
  default: {
    paths: ['features/**/*.feature'],
    requireModule: ['ts-node/register'],
    require: ['hooks/**/*.ts', 'step-definitions/**/*.ts'],
    format: ['progress', 'html:reports/cucumber-report.html'],
  },
};
