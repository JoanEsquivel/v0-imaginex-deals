import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    defaultBrowser: 'chrome',
    projectId: "t9de1s",
  },
});
