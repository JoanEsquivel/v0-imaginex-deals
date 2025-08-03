import { test, expect } from '@/playwright/fixtures/index.fixtures';

const username = 'test_user';
const password = 'test_pass';
const incorrectPassword = 'incorrect_pass';

test.describe('Login & Logout Scenarios', () => {
  test('login and logout workflow', async ({ e2e }) => {
    await e2e.loginAndLogout(username, password);
  });

  test('login with incorrect password', async ({ loginPage }) => {
    await loginPage.load();
    await loginPage.submitSignInForm(username, incorrectPassword);
    await expect(loginPage.errorContainer).toHaveText(/There was a problem.*Invalid username or password/);
  })
});
