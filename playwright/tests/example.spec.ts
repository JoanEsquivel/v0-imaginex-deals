import { test, expect } from '@/playwright/fixtures/index.fixtures';
import 'dotenv/config'

const secrets: NodeJS.ProcessEnv = process.env;



test.describe('Login Workflow', () => {
  test('should login with valid credentials', async ({ loginPage }) => {
    await loginPage.load();
    await loginPage.waitLoad();
    await loginPage.submitSignInForm(secrets.SUCCESSFUL_USERNAME, secrets.SUCCESSFUL_PASSWORD);
    await expect(loginPage.page).toHaveURL('/products');
  });
});
