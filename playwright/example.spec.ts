import { test, expect } from '@/playwright/fixtures/index.fixtures';
import data from '@/playwright/data/testData.json';


// Username and password are sensitive data. I am using this approach just for demo purposes. 
// In real life, I would use environment variables or a separate file for this.

test.describe('Login & Logout Scenarios', () => {
  test('should_login_and_logout_successfully', async ({ e2e }) => {
    await e2e.loginAndLogout(data.username, data.password);
  });

  test('should_not_login_with_invalid_credentials', async ({ loginPage }) => {
    await loginPage.load();
    await loginPage.submitSignInForm(data.username, data.incorrectPassword);
    await expect(loginPage.errorContainer).toHaveText(/There was a problem.*Invalid username or password/);
  })
});
