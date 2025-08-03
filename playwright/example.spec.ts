import { test, expect } from '@/playwright/fixtures/index.fixtures';
import data from '@/playwright/data/testData.json';


// Username and password are sensitive data. I am using this approach just for demo purposes. 
// In real life, I would use environment variables or a separate file for this.

test.describe('Login & Logout Scenarios', () => {

  test('should_not_login_with_invalid_credentials', async ({ loginPage }) => {
    await loginPage.load();
    await loginPage.submitSignInForm(data.username, data.incorrectPassword);
    await expect(loginPage.errorContainer).toHaveText(/There was a problem.*Invalid username or password/);
  })

  test('should_login_and_logout_successfully', async ({ e2e }) => {
    await e2e.loginAndLogout(data.username, data.password);
  });

  // What is new in Playwright?

  /*
    1- Disable code snippets in the html report
      playwright.config.ts:
      reporter: [['html', { noSnippets: true }]]
  */

  /*
    2- New option in 'html' reporter to set the title of a specific test run
      reporter: [['html', { title: 'Custom test run #1028' }]]
  */

  /*
    3- New method locator.describe() to describe a locator. Used for trace viewer and reports
      const button = page.getByTestId('btn-sub').describe('Subscribe button');
  */

  /*
    4- npx playwright install --list will now list all installed browsers, versions and locations.
  */

  /*
    5- Copy as prompt
    New "Copy prompt" button on errors in the HTML report, trace viewer and UI mode
    Click to copy a pre-filled LLM prompt that contains the error message and useful context for fixing the error.
  */

  /*
    6-Set option testConfig.captureGitInfo to capture git information into testConfig.metadata.

      import { defineConfig } from '@playwright/test';

      export default defineConfig({
        captureGitInfo: { commit: true, diff: true }
      });
  */

  /*
    7- New method test.step.skip() to disable execution of a test step.
      await test.step('before running step', async () => {
          // Normal step
        });

        await test.step.skip('not yet ready', async () => {
          // This step is skipped
        });

        await test.step('after running step', async () => {
          // This step still runs even though the previous one was skipped
        });

    check my example under utils/e2e.ts -> loginAndLogout() 
  */

  /*
    8- New option timeout allows specifying a maximum run time for an individual test step. A timed-out step will fail the execution of the test.
    
    
    await test.step('a step', async () => {
      // This step can time out separately from the test
      }, { timeout: 1000 });

      check my example under utils/e2e.ts -> loginAndLogout() 
  */

  /*
    9- --only-changed cli option
    New CLI option --only-changed will only run test files that have been changed since the last git commit or from a specific git "ref". 
    This will also run all test files that import any changed files.

    # Only run test files with uncommitted changes
    npx playwright test --only-changed

    # Only run test files changed relative to the "main" branch
    npx playwright test --only-changed=main
  */

});
