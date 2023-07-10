const { defineConfig } = require("cypress");
require('dotenv').config();

module.exports = defineConfig({
  e2e: {
    baseUrl: process.env.domain,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  env: process.env,
  viewportWidth: 1280,
  viewportHeight: 768
});
