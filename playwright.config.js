const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30 * 1000,
  use: {
    headless: true,
    viewport: { width: 1280, height: 1024 },
    actionTimeout: 10 * 1000,
    ignoreHTTPSErrors: true,
  },
});
